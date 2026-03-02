import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Order, Orders } from '../../libs/dto/order/order';
import { OrderInput, OrdersInquiry, UpdateOrderInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId, Types } from 'mongoose';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async createOrder(@Args('input') input: OrderInput, @AuthMember('_id') memberId: ObjectId): Promise<Order> {
		console.log('Mutation: createOrder');
		return this.orderService.createOrder(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async updateOrder(@Args('input') input: UpdateOrderInput): Promise<Order> {
		console.log('Mutation: updateOrder');
		return this.orderService.updateOrder(input);
	}


	@UseGuards(AuthGuard)
	@Query(() => Order)
	async getOrder(@Args('orderId') orderId: string): Promise<Order> {
		console.log('Query: getOrder');
		return this.orderService.getOrder(orderId);
	}

	@Query(() => Orders)
	@UseGuards(AuthGuard) // Foydalanuvchi tizimga kirgan bo'lishi shart
	async getMyOrders(@Args('input') input: OrdersInquiry, @AuthMember('_id') memberId: Types.ObjectId): Promise<Orders> {
		return this.orderService.getMyOrders(memberId, input);
	}
}
