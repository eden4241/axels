import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductStatus } from '../../enums/product.enum';
import { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';

/** GraphQL type for product inside cart – matches TypeORM Product.entity */
@ObjectType()
export class CartProduct {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ProductStatus)
	productStatus: ProductStatus;

	@Field(() => String)
	productName: string;

	@Field(() => Number)
	productPrice: number;

	@Field(() => String, { nullable: true })
	productDuration?: string;

	@Field(() => String, { nullable: true })
	productDesc?: string;

	@Field(() => [String], { nullable: true })
	productImages: string[];

	@Field(() => Int)
	productViews: number;

	@Field(() => Int, { nullable: true })
	productVolumeMl?: number;

	@Field(() => Int)
	productQuantity: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Cart {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => CartProduct, { nullable: true })
	product?: CartProduct;

	@Field(() => Int)
	quantity: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;
}

@ObjectType()
export class Carts {
	@Field(() => [Cart])
	list: Cart[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter?: TotalCounter[];
}

