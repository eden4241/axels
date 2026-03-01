import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CartSchema from '../../schemas/Cart.model';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
		AuthModule,
		ProductModule,
	],
	providers: [CartService, CartResolver],
	exports: [CartService],
})
export class CartModule {}
