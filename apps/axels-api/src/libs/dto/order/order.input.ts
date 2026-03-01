import { Field, Float, ID, InputType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";


@InputType()
class OrderItemInput {
  @Field(() => ID)
  productId: ObjectId;

  @Field(() => Number)
  itemQuantity: number;

  @Field(() => Float)
  itemPrice: number;
}

@InputType()
export class OrderInput {
  @Field(() => Float)
  orderTotal: number;

  @Field(() => Float)
  orderDelivery: number;

  @Field(() => [OrderItemInput]) // Savatdagi barcha mahsulotlar ro'yxati
  orderItems: OrderItemInput[];
}