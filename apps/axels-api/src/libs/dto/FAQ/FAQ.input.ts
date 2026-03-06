import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { FAQCategory, FAQStatus } from "../../enums/FAQ";
import { ObjectId } from "mongoose";

@InputType()
export class FAQInput {
  @IsNotEmpty()
  @Field(() => String)
  question: string;

  @IsNotEmpty()
  @Field(() => String)
  answer: string;

  @IsNotEmpty()
  @Field(() => FAQCategory)
  category: FAQCategory;

  @IsOptional()
  @Field(() => FAQStatus, { nullable: true })
  status?: FAQStatus;
}

@InputType()
export class FAQUpdate {

  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => String, { nullable: true })
  question?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  answer?: string;

  @IsOptional()
  @Field(() => FAQCategory, { nullable: true })
  category?: FAQCategory;

  @IsOptional()
  @Field(() => FAQStatus, { nullable: true })
  status?: FAQStatus;
}