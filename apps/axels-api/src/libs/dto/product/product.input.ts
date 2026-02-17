import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import {
	ProductBrand,
	ProductMaterial,
	ProductSize,
	ProductStatus,
	ProductType,
} from '../../enums/product.enum';
import { availableProductSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

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

@InputType()
export class PriceRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}
	

@InputType()
export class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	typeList?: ProductType[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	brandList?: ProductBrand[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	materialList?: ProductMaterial[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	sizeList?: ProductSize[];

	@IsOptional()
	@Field(() => PriceRange, { nullable: true })
	priceRange?: PriceRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => PISearch, { nullable: true })
	search?: PISearch;
}

@InputType()
export class SPISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;
}

@InputType()	
export class SellerProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => SPISearch, { nullable: true })
	search?: SPISearch;
}
