import { InputType, Field } from '@nestjs/graphql';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
export class OrderInput {
	@Field(() => Number)
	orderTotal: number;

	@Field(() => Number)
	orderDelivery: number;

	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;

	@Field({ nullable: true })
	memberId?: string;
}
