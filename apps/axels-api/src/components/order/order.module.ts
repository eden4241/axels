import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema from '../../schemas/Order.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ProductModule } from '../product/product.module';
import ProductSchema from '../../schemas/Product.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
		AuthModule,
		MemberModule,
		ProductModule,
	],
	providers: [OrderResolver, OrderService],
})
export class OrderModule {}
