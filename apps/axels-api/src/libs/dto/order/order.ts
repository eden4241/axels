import { ObjectType, Field } from '@nestjs/graphql';
import { OrderStatus } from '../../enums/order.enum';

@ObjectType()
export class Order {
	@Field()
	_id: string;

	@Field(() => Number)
	orderTotal: number;

	@Field(() => Number)
	orderDelivery: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;


	memberId?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

