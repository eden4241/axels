import { ObjectType, Field } from '@nestjs/graphql';
import { FAQCategory, FAQStatus } from '../../enums/FAQ';
import { ObjectId } from 'mongoose';

/** GraphQL output type for FAQ (mutation/query return type). */
@ObjectType()
export class Faq {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	question: string;

	@Field(() => String)
	answer: string;

	@Field(() => FAQCategory)
	category: FAQCategory;

	@Field(() => FAQStatus, { nullable: true })
	status?: FAQStatus;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}