import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class CreateContactInput {
	@IsNotEmpty()
	@MaxLength(80)
	@Field(() => String)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(120)
	@Field(() => String)
	email: string;

	@IsOptional()
	@MaxLength(120)
	@Field(() => String, { nullable: true })
	subject?: string;

	@IsNotEmpty()
	@MaxLength(2000)
	@Field(() => String)
	message: string;
}

