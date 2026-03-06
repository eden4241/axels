import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { Faq } from '../../libs/dto/FAQ/FAQ';
import { FAQInput, FAQUpdate } from '../../libs/dto/FAQ/FAQ.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class FaqResolver {
	constructor(private readonly faqService: FaqService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Faq)
	public async createFaq(@Args('input') input: FAQInput): Promise<Faq> {
		return await this.faqService.createFaq(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Faq)
	public async updateFaq(@Args('input') input: FAQUpdate): Promise<Faq> {
		return await this.faqService.updateFaq(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Boolean)
	public async deleteFaq(@Args('id') id: string): Promise<boolean> {
		return await this.faqService.deleteFaq(id);
	}

	// faq.resolver.ts ichiga qo'shing
	@Query(() => [Faq],) // [Faq] massiv qaytishini bildiradi
	public async getAllFaqs(): Promise<Faq[]> {
		return await this.faqService.getAllFaqs();
	}
}
