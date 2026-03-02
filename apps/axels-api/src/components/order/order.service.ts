import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Order, Orders } from '../../libs/dto/order/order';
import { OrderInput, OrdersInquiry, UpdateOrderInput } from '../../libs/dto/order/order.input';
import { Message } from '../../libs/enums/common.enum';
import { OrderStatus } from '../../libs/enums/order.enum';
import { MemberService } from '../member/member.service';
import { Product } from '../../libs/dto/product/product';
import { ProductService } from '../product/product.service';
import { T } from '../../libs/types/common';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private readonly memberService: MemberService,
		private readonly productService: ProductService,
	) {}

	public async createOrder(memberId: ObjectId, input: OrderInput): Promise<Order> {
		try {
			const { orderItems } = input;
			let calculatedTotal = 0;
			const finalizedItems = [];

			for (const item of orderItems) {
				// 1. Mahsulotni topish
				const product = await this.productModel.findById(item.productId);
				if (!product) throw new BadRequestException(Message.PRODUCT_NOT_FOUND);

				// 2. Ombor qoldig'ini tekshirish
				if (product.productStock < item.itemQuantity) {
					throw new BadRequestException(
						`Insufficient stock for "${product.productTitle}". Available: ${product.productStock}`,
					);
				}

				// 3. Narxni hisoblash (DIQQAT: bu yerda ko'paytirish bo'lishi kerak, qo'shish emas)
				const itemPrice = product.productPrice;
				calculatedTotal += itemPrice * item.itemQuantity; // TO'G'RI: narx * soni

				finalizedItems.push({
					productId: item.productId,
					itemQuantity: item.itemQuantity,
					itemPrice: itemPrice,
				});

				// 4. Ombordagi qoldiqni kamaytirish (Sizda bu amal 2 marta takrorlangan, bittasi yetarli)
				await this.productService.productStatsEditor({
					_id: item.productId,
					targetKey: 'productStock',
					modifier: -item.itemQuantity,
				});
			}

			// 5. Yetkazib berish narxini aniqlash (100,000 won sharti)
			const deliveryFee = calculatedTotal >= 1000000 ? 0 : 30000;

			// 6. Buyurtmani yaratish
			const result = await this.orderModel.create({
				memberId: memberId,
				orderItems: finalizedItems,
				orderTotal: calculatedTotal + deliveryFee, // Jami: mahsulotlar + dostavka
				orderDelivery: deliveryFee,
				orderStatus: OrderStatus.PAUSE, // Siz PAUSE deb belgiladingiz
			});

			// 7. Foydalanuvchi statistikasini yangilash
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberOrders',
				modifier: 1,
			});

			return result;
		} catch (err) {
			console.log('Error, OrderService.createOrder:', err.message);
			throw new BadRequestException(err.message || Message.CREATE_FAILED);
		}
	}

	async updateOrder(input: UpdateOrderInput): Promise<Order> {
		const { _id, orderStatus, orderDelivery } = input;

		const updatedOrder = await this.orderModel
			.findOneAndUpdate(
				{ _id: _id },
				{ $set: { orderStatus, orderDelivery } },
				{ new: true }, // Yangilangan ob'ektni qaytarish uchun
			)
			.exec();

		if (!updatedOrder) {
			throw new Error('Order not found!');
		}

		return updatedOrder;
	}

	async getOrder(orderId: string): Promise<Order> {
		const result = await this.orderModel.findById(orderId).exec();

		if (!result) throw new Error('Order not found!');
		return result;
	}

	async getMyOrdes(memberId: string): Promise<Order[]> {
		return await this.orderModel
			.find({ memberId })
			.sort({ createdAt: -1 }) // Oxirgi buyurtmalar tepada tursin
			.exec();
	}

	public async getMyOrders(memberId: string | Types.ObjectId, input: OrdersInquiry): Promise<Orders> {
        const { page, limit, sort, direction } = input;

        // 1. Match obyektini tayyorlash (ObjectId ga aylantirish shart!)
        const match: any = { 
            memberId: new Types.ObjectId(memberId.toString()), 
        };
        

        // 2. Aggregate orqali ma'lumotni olish
        const result = await this.orderModel
            .aggregate([
                { $match: match }, 
                { $sort: { createdAt: -1 } },
                {
                    $facet: {
                        list: [{ $match: {} }], // Hozircha hamma topilganlarni listga olamiz
                        metaCounter: [{ $count: 'total' }]
                    }
                }
            ])
            .exec();

        // 3. Natijani tekshirish va kutilgan formatda qaytarish
        const list = result[0]?.list || [];
        const total = result[0]?.metaCounter[0]?.total || 0;

        return {
            list: list,
            metaCounter: [{ total: total }]
        };
    }
}

