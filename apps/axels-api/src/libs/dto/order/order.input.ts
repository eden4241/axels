import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
class OrderItemInput {
	@Field(() => String)
	productId: ObjectId;

	@Field(() => Number)
	itemQuantity: number;
}

@InputType()
export class OrderInput {
	@Field(() => [OrderItemInput]) // Savatdagi barcha mahsulotlar ro'yxati
	orderItems: OrderItemInput[];
}

@InputType()
export class UpdateOrderInput {
	@Field(() => String)
	_id: string; // Qaysi buyurtmani yangilashni bilish uchun ID shart

	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;

	@Field(() => Number, { nullable: true })
	orderDelivery?: number;
}

@InputType()
export class OrdersInquiry {

	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;

	@Field(() => Number, { nullable: true })
	page?: number;

	@Field(() => Number, { nullable: true })
	limit?: number;

	@Field(() => String, { nullable: true })
	sort?: string;

	@Field(() => String, { nullable: true })
	direction?: string;
}
