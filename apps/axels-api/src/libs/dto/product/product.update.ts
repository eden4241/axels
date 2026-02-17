import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, Length } from "class-validator";
import { ObjectId } from "mongoose";
import { ProductBrand, ProductMaterial, ProductPurity, ProductSize, ProductStatus, ProductType } from "../../enums/product.enum";


@InputType()
export class ProductUpdate {
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;

    @IsOptional()
    @Field(() => ProductType, { nullable: true })
    productType?: ProductType;

    @IsOptional()
    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;

    @IsOptional()
    @Field(() => ProductMaterial, { nullable: true })
    productMaterial?: ProductMaterial;

    @IsOptional()
    @Field(() => ProductBrand, { nullable: true })
    productBrand?: ProductBrand;

    @IsOptional()
    @Field(() => ProductSize, { nullable: true })
    productSize?: ProductSize;

    @IsOptional()
    @Field(() => ProductPurity, { nullable: true })
    productPurity?: ProductPurity;

    @IsOptional()
    @Length(3, 100)
    @Field(() => String, { nullable: true })
    productTitle?: string;

    @IsOptional()
    @Field(() => Number, { nullable: true })
    productPrice?: number;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    productImages?: string[];

    @IsOptional()
    @Field(() => String, { nullable: true })
    productDesc?: string;

    soldAt?: Date;

    deletedAt?: Date;
    
}