import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartInput, CartRemoveInput, CartUpdateInput } from '../../libs/dto/cart/cart.input';
import { Cart, Carts } from '../../libs/dto/cart/cart';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongooseObject } from '../../libs/config';

@Resolver(() => Cart)
export class CartResolver {
	constructor(private readonly cartService: CartService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Cart)
	public async addToCart(
		@Args('input') input: CartInput, //
		@AuthMember('_id') memberId: string,
	): Promise<Cart> {
		console.log('Mutation: addToCart');
		return this.cartService.addToCart(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Cart)
	public async getCart(@Args('cartId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Cart> {
		console.log('Query: getCart');
		const cartId = shapeIntoMongooseObject(input);
		return this.cartService.getCart(memberId, cartId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Cart)
	public async updateCart(
		@Args('input') input: CartUpdateInput, //
		@AuthMember('_id') memberId: string,
	): Promise<Cart> {
		return this.cartService.updateCart(memberId, input._id, input.quantity);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Cart)
	public async removeFromCart(
		@Args('input') input: CartRemoveInput,
		@AuthMember('_id') memberId: string,
	): Promise<Cart> {
		console.log('Mutation: removeFromCart');
		return this.cartService.removeFromCart(memberId, input._id);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async clearCart(@AuthMember('_id') memberId: string): Promise<boolean> {
		console.log('Mutation: clearCart');
		return this.cartService.clearCart(memberId);
	}
}
