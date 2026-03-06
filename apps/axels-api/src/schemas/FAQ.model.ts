import { Schema } from 'mongoose';
import { FAQCategory } from '../libs/enums/FAQ';

const FAQSchema = new Schema(
	{
		question: { type: String, required: true },
		answer: { type: String, required: true },
		status: { type: String, default: 'ACTIVE' },
		category: { type: String, default: 'GENERAL', required: true },
	},
	{ timestamps: true, collection: 'faqs' },
);

export default FAQSchema;
