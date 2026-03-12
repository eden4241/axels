import { Schema } from 'mongoose';

const ContactSchema = new Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 80 },
		email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
		subject: { type: String, trim: true, maxlength: 120 },
		message: { type: String, required: true, trim: true, maxlength: 2000 },
	},
	{ timestamps: { createdAt: true, updatedAt: false }, collection: 'contacts' },
);

ContactSchema.index({ email: 1, createdAt: -1 });

export default ContactSchema;

