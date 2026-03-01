import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Cart, Carts } from '../../libs/dto/cart/cart';
import { CartInput } from '../../libs/dto/cart/cart.input';
import { Message } from '../../libs/enums/common.enum';
import { ProductService } from '../product/product.service';
import { shapeIntoMongooseObject } from '../../libs/config';
import { T } from '../../libs/types/common';

const MIN_QUANTITY = 1;

@Injectable()
export class CartService {
	constructor(
		@InjectModel('Cart') private readonly cartModel: Model<Cart>,
		private readonly productService: ProductService,
	) {}

	public async addToCart(memberId: string, input: CartInput): Promise<Cart> {
		const qty = Math.max(MIN_QUANTITY, input.quantity ?? MIN_QUANTITY);
		const productId = shapeIntoMongooseObject(input.productId);

		const product = await this.productService.findActiveById(productId);
		if (!product) {
			throw new BadRequestException(Message.NO_DATA_FOUND);
		}

		const existing = await this.cartModel.findOne({
			memberId,
			productId,
		});

		if (existing) {
			const newQty = existing.quantity + qty;
			const updated = await this.cartModel.findByIdAndUpdate(existing._id, { quantity: newQty }, { new: true }).exec();
			return updated as Cart;
		}

		const cart = await this.cartModel.create({
			memberId,
			productId,
			quantity: qty,
		});
		return cart;
	}

	public async getCart(memberId: ObjectId, cartId: ObjectId): Promise<Cart> {
		const search: T = {
			_id: cartId,
			memberId: memberId,
		};
		const targetCart: Cart = await this.cartModel.findOne(search).exec();
		if (!targetCart) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return targetCart;
	}
	public async updateCart(memberId: string, id: string, quantity: number): Promise<Cart> {
		if (quantity < MIN_QUANTITY) {
			throw new BadRequestException('Quantity must be at least 1');
		}
		const cart = await this.cartModel.findOneAndUpdate({ _id: id, memberId }, { quantity }, { new: true }).exec();
		if (!cart) {
			throw new ForbiddenException(Message.NOT_ALLOWED_REQUEST);
		}
		return cart as Cart;
	}

	public async removeFromCart(memberId: string, id: string): Promise<Cart> {
		const cart = await this.cartModel.findOneAndDelete({ _id: id, memberId }).exec();
		if (!cart) {
			throw new ForbiddenException(Message.NOT_ALLOWED_REQUEST);
		}
		return cart as Cart;
	}

	public async clearCart(memberId: string): Promise<boolean> {
		await this.cartModel.deleteMany({ memberId }).exec();
		return true;
	}
}
