import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order } from '../../libs/dto/order/order';
import { OrderInput } from '../../libs/dto/order/order.input';
import { Message } from '../../libs/enums/common.enum';
import { OrderStatus } from '../../libs/enums/order.enum';
import { MemberService } from '../member/member.service';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		private readonly memberService: MemberService,
	) {}

	public async createOrder(memberId: ObjectId, input: OrderInput): Promise<Order> {
		try {
			const result = await this.orderModel.create({ ...input, memberId: memberId, orderStatus: OrderStatus.PAUSE });
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberOrders',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
