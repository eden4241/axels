import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ProductBrand, ProductMaterial, ProductPurity, ProductSize, ProductStatus, ProductType } from '../../enums/product.enum';

@ObjectType()
export class Product {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ProductType)
	productType: ProductType;

	@Field(() => ProductStatus)
	productStatus: ProductStatus;

	@Field(() => ProductMaterial)
	productMaterial: ProductMaterial;

	@Field(() => ProductBrand)
	productBrand: ProductBrand;

	@Field(() => ProductSize)
	productSize: ProductSize;

	@Field(() => ProductPurity, { nullable: true })
	productPurity?: ProductPurity;

	@Field(() => String)
	productTitle: string;

	@Field(() => Number)
	productPrice: number;

	@Field(() => Int)
	productViews: number;

	@Field(() => Int)
	productLikes: number;

	@Field(() => Int)
	productComments: number;

	@Field(() => Int)
	productRank: number;

	@Field(() => [String])
	productImages: string[];

	@Field(() => String, { nullable: true })
	productDesc?: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation */
	// @Field(() => [MeLiked], { nullable: true })
	// meLiked?: MeLiked[];
	
	// @Field(() => Member, {nullable: true})
	// memberData?: Member;
}