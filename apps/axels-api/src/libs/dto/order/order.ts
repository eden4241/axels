import { ObjectType, Field } from '@nestjs/graphql';
import { OrderStatus } from '../../enums/order.enum';
import { ObjectId } from 'mongoose';
import { Product } from '../product/product';
import { TotalCounter } from '../member/member';

@ObjectType()
export class OrderItem {
	@Field(() => Number)
	itemQuantity: number;

	@Field(() => Number)
	itemPrice: number;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => Product, { nullable: true })
	productData?: Product;
}

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Number)
	orderTotal: number;

	@Field(() => Number)
	orderDelivery: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => [OrderItem])
	orderItems: OrderItem[];
}



@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
