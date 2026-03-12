import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Contact {
	@Field(() => String)
	_id: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	email: string;

	@Field(() => String, { nullable: true })
	subject?: string;

	@Field(() => String)
	message: string;

	@Field(() => Date)
	createdAt: Date;
}

