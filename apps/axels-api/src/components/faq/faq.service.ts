import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq } from '../../libs/dto/FAQ/FAQ';
import { FAQInput, FAQUpdate } from '../../libs/dto/FAQ/FAQ.input';

@Injectable()
export class FaqService {
	constructor(@InjectModel('FAQ') private readonly faqModel: Model<Faq>) {}

	public async createFaq(input: FAQInput): Promise<Faq> {
		const newFaq = new this.faqModel(input);
		return await newFaq.save();
	}

	public async updateFaq(input: FAQUpdate): Promise<Faq> {
		const { _id, ...updateData } = input;

		const result = await this.faqModel.findOneAndUpdate({ _id: _id }, updateData, { new: true }).exec();

		if (!result) {
			throw new Error('FAQ topilmadi!');
		}

		return result;
	}

	public async deleteFaq(id: string): Promise<boolean> {
		const result = await this.faqModel.findByIdAndDelete(id).exec();

		if (!result) {
			throw new Error('O‘chirish uchun FAQ topilmadi!');
		}

		return true; // Muvaffaqiyatli o'chirilganini bildiradi
	}

	// faq.service.ts ichiga qo'shing
	public async getAllFaqs(): Promise<Faq[]> {
		return await this.faqModel.find().sort({ createdAt: -1 }).exec();
		// .sort({ createdAt: -1 }) yangilarini tepada ko'rsatadi
	}
}
