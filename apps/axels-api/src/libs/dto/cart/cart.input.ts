import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CartInput {
	// @Field(() => String)
	// memberId: string;

	@Field(() => String)
	productId: string;

	@Field(() => Int, { nullable: true })
	quantity?: number;
}

@InputType()
export class CartUpdateInput {
	@Field(() => String)
	_id: string;

	@Field(() => Int)
	quantity: number;
}

@InputType()
export class CartRemoveInput {
	@Field(() => String)
	_id: string;
}

