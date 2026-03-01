# Cart System – Logic Audit Report

Production-level audit of the e-commerce cart implementation. Issues found are listed with severity; fixes applied in code are summarized at the end.

---

## 1. BUSINESS LOGIC VALIDATION

### 1.1 Add to cart – FIXED
- **Duplicate handling:** One item per (memberId, productId); quantity is incremented. Correct.
- **Product existence/status:** Previously missing. **Fixed:** `addToCart` now calls `ProductService.findActiveById(productId)` and throws `BadRequestException(NO_DATA_FOUND)` if product is missing or not ACTIVE.
- **Negative/zero quantity:** Previously allowed. **Fixed:** `quantity` is forced with `Math.max(MIN_QUANTITY, input.quantity ?? MIN_QUANTITY)` (min 1).
- **Stock:** Product schema has no `productQuantity` (stock) field. **Recommendation:** When you add inventory, enforce `quantity <= product.productQuantity` and reject with a clear message when out of stock.

### 1.2 Remove from cart – FIXED
- **Ownership:** Previously any user could delete any cart item by ID. **Fixed:** `removeFromCart(memberId, id)` uses `findOneAndDelete({ _id: id, memberId })` so only the owner can remove. Returns `ForbiddenException(NOT_ALLOWED_REQUEST)` when not found (wrong ID or wrong user).
- **Input:** **Improved:** New `CartRemoveInput` with only `_id` (no redundant `quantity`).

### 1.3 Update quantity – FIXED
- **Negative/zero quantity:** Previously allowed. **Fixed:** `if (quantity < MIN_QUANTITY)` throws `BadRequestException('Quantity must be at least 1')`. Schema also has `quantity: { min: 1 }`.
- **Ownership:** Previously any user could update any cart item. **Fixed:** `updateCart(memberId, id, quantity)` uses `findOneAndUpdate({ _id: id, memberId }, { quantity })`. No match → `ForbiddenException(NOT_ALLOWED_REQUEST)`.

### 1.4 Price consistency
- Cart does not store price; it uses live product data via `populate('productId')`. So price is always current when viewing cart. **Good.** At checkout you must re-read product price (and stock) from DB and never trust client or stored cart “price”.

### 1.5 Cart total / tax / discount
- No cart total, tax, or discount in schema or API. **Recommendation:** Add a computed field or dedicated query (e.g. `cartSummary(memberId)` returning `{ items, subtotal, tax, total }`) when you introduce pricing rules.

---

## 2. EDGE CASES

### 2.1 Product deleted after adding to cart – FIXED
- **getCart:** Previously could return items with `productId: null` after product deletion. **Fixed:** `getCart` uses `.filter((item) => item.productId != null)` so deleted products are not shown. Orphan cart rows remain in DB until cleanup (see 3.2).

### 2.2 Stock becomes 0 after item added
- Not applicable until you add a stock field. When you do: on checkout or when displaying cart, re-validate stock and cap or reject quantity.

### 2.3 User logs out
- Cart is keyed by `memberId`. Logged-out users have no cart in this design (no guest cart). **Acceptable** if product requirement is “logged-in only” cart.

### 2.4 Guest cart
- Not implemented. **Recommendation:** If needed, use anonymous ID in cookie/localStorage and merge into `memberId` cart on login.

### 2.5 Concurrent requests
- **addToCart (existing item):** Previously read-then-save (race). **Fixed:** Uses `findByIdAndUpdate(existing._id, { quantity: newQty })` so quantity update is atomic.
- **updateCart:** Single `findOneAndUpdate` – atomic. **Good.**

### 2.6 Empty cart
- `getCart` returns `[]`. No special handling needed. **Good.**

### 2.7 Large quantity
- Schema has `min: 1` but no max. **Recommendation:** Add `max` (e.g. 999) and/or validate against stock when you have inventory.

---

## 3. DATABASE & DATA INTEGRITY

### 3.1 References
- Cart has `memberId` (ref: Member), `productId` (ref: Product). Refs are correct. **Good.**

### 3.2 Orphan cart items
- When a product is deleted, cart documents with that `productId` remain. **Fixed:** `getCart` hides them (filter by `productId != null`). **Recommendation:** Add a periodic job or cleanup on product delete to `deleteMany({ productId: deletedId })` to avoid orphan growth.

### 3.3 Schema relationships
- Mongoose refs and timestamps are correct. **Good.**

### 3.4 Indexing – FIXED
- **Fixed:** `CartSchema.index({ memberId: 1, productId: 1 }, { unique: true })` for add/get and uniqueness; `CartSchema.index({ memberId: 1 })` for getCart/clearCart.

### 3.5 Atomic updates
- addToCart (existing): `findByIdAndUpdate(..., { quantity: newQty })` – atomic. **Good.**
- updateCart: single `findOneAndUpdate` – atomic. **Good.**

### 3.6 Race conditions
- Quantity updates are single-doc updates; ownership is enforced by `memberId` in the same query. **Good.**

---

## 4. SECURITY

### 4.1 Price manipulation
- Price is not stored in cart; it comes from product at read time. **Good.** At checkout, always use server-side product price.

### 4.2 User ownership – FIXED
- **getCart / clearCart:** Use `@AuthMember('_id')` and filter by `memberId`. **Good.**
- **updateCart / removeFromCart:** Previously did not check ownership. **Fixed:** Both now take `memberId` and use `findOneAndUpdate` / `findOneAndDelete` with `{ _id, memberId }`. Wrong user or wrong ID → 403.

### 4.3 ID tampering
- updateCart/removeFromCart only affect documents where `memberId` matches the authenticated user. **Good.**

### 4.4 Validation and sanitization
- `memberId` is from token (AuthGuard + AuthMember). **Good.**
- `productId` and `_id` are passed through; Mongoose cast will reject invalid ObjectIds. **Recommendation:** Add class-validator on inputs (e.g. IsMongoId()) for clearer 400 responses.

### 4.5 Mass assignment
- CartInput only exposes `productId` and `quantity`; `memberId` is server-set. **Good.**

---

## 5. PERFORMANCE

### 5.1 N+1
- getCart: one `find({ memberId }).populate('productId')` – no N+1. **Good.**

### 5.2 Queries
- addToCart: one product check + one findOne (cart) + one create or findByIdAndUpdate. **Acceptable.**
- Indexes on (memberId, productId) and (memberId) keep queries efficient. **Good.**

### 5.3 Population
- Single populate on `productId`. **Good.** If Product schema grows, consider populating only needed fields via `.populate('productId', 'productTitle productPrice ...')`.

### 5.4 Cart total
- No total in current design. When added, compute in one aggregation (e.g. $lookup product, $project subtotal, $group sum) rather than in a loop. **Recommendation** when you add totals.

---

## 6. CODE QUALITY

### 6.1 Duplication
- MIN_QUANTITY constant used in add and update. **Good.**
- Ownership check is “same doc by id + memberId” in update and remove – no extra duplication.

### 6.2 Readability
- Method names and parameters are clear. **Good.**
- **Improved:** `CartRemoveInput` separates “remove” from “update” input.

### 6.3 Structure
- Resolver: auth + args; service: business logic. **Good.**
- Product check delegated to `ProductService.findActiveById` – no duplicate product logic in cart. **Good.**

### 6.4 Naming
- `CartRemoveInput` for remove; `CartUpdateInput` for update. **Good.**

### 6.5 DTO vs schema mismatch (CartProduct)
- `CartProduct` in DTO has `productName`, `productQuantity`, etc. Mongoose Product schema has `productTitle` (not `productName`) and no `productQuantity`. Populate returns Product documents. **Risk:** GraphQL might expect `productName` / `productQuantity` and get wrong or null. **Recommendation:** Align CartProduct with Product schema (e.g. `productTitle`) or map in a field resolver from `productId` (populated) to the shape CartProduct expects.

---

## 7. SUMMARY OF FIXES APPLIED

| Area | Change |
|------|--------|
| Security | updateCart and removeFromCart now require cart to belong to `memberId` (from token). |
| Validation | addToCart: product must exist and be ACTIVE; quantity ≥ 1. updateCart: quantity ≥ 1. |
| Schema | quantity `min: 1`; unique index (memberId, productId); index (memberId). |
| Atomicity | addToCart (existing item) uses findByIdAndUpdate for quantity. |
| Orphans | getCart filters out items where productId is null (deleted product). |
| API | CartRemoveInput added for removeFromCart (only _id). |
| Product check | ProductService.findActiveById used in addToCart; CartModule imports ProductModule. |

---

## 8. RECOMMENDATIONS (NOT DONE IN THIS PASS)

1. **Stock:** Add `productQuantity` (or similar) to Product; in addToCart and updateCart enforce `quantity <= stock` and handle “out of stock” messaging.
2. **Orphan cleanup:** On product delete (or soft-delete), remove or invalidate cart items referencing that product.
3. **Cart total:** Add a query or computed field for subtotal (and later tax/discount) when you need it.
4. **Input validation:** Use class-validator (IsMongoId, Min, Max) on CartInput and CartUpdateInput/CartRemoveInput.
5. **CartProduct DTO:** Align with Product schema (e.g. productTitle, and productQuantity when you add stock) or map in resolver.
6. **Max quantity:** Add schema `max` and/or business rule to cap quantity (e.g. 999 or stock).
7. **Guest cart:** If required, design anonymous cart and merge on login.

This audit and the applied fixes bring the cart in line with secure, consistent, and maintainable behavior for production use, with clear next steps when you add stock and pricing features.
