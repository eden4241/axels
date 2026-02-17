import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { ProductBrand, ProductMaterial, ProductPurity, ProductSize, ProductStatus, ProductType } from '../../enums/product.enum';

@InputType()
export class ProductInput {
	@IsNotEmpty()
	@Field(() => ProductType)
	productType: ProductType;

	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

    @IsNotEmpty()
	@Field(() => ProductMaterial)
	productMaterial: ProductMaterial;

    @IsNotEmpty()
	@Field(() => ProductBrand)
	productBrand: ProductBrand;

    @IsNotEmpty()
	@Field(() => ProductSize)
	productSize: ProductSize;

	@IsOptional()
	@Field(() => ProductPurity, { nullable: true })
	productPurity?: ProductPurity;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	productTitle: string;

	@IsNotEmpty()
	@Min(0)
	@Type(() => Number)
	@Field(() => Number)
	productPrice: number;

	@IsNotEmpty()
	@Field(() => [String])
	productImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	productDesc?: string;

	memberId: ObjectId;
}