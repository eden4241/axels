import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../../libs/dto/contact/contact';
import { CreateContactInput } from '../../libs/dto/contact/contact.input';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class ContactService {
	constructor(@InjectModel('Contact') private readonly contactModel: Model<Contact>) {}

	async createContact(input: CreateContactInput): Promise<Contact> {
		try {
			return await this.contactModel.create(input);
		} catch (err: any) {
			// Keep error surface small (avoid leaking internals)
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	async findAllContacts(): Promise<Contact[]> {
		return this.contactModel.find().sort({ createdAt: -1 }).lean().exec() as Promise<Contact[]>;
	}
}

