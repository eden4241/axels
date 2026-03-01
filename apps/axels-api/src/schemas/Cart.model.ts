import { Schema } from 'mongoose';

const CartSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
	},
	{ timestamps: true, collection: 'carts' },
);

CartSchema.index({ memberId: 1, productId: 1 }, { unique: true });
CartSchema.index({ memberId: 1 });

export default CartSchema;