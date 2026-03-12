import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { Contact } from '../../libs/dto/contact/contact';
import { CreateContactInput } from '../../libs/dto/contact/contact.input';

@Resolver(() => Contact)
export class ContactResolver {
	constructor(private readonly contactService: ContactService) {}

	@Mutation(() => Contact)
	async createContact(@Args('createContactInput') input: CreateContactInput): Promise<Contact> {
		return this.contactService.createContact(input);
	}

	@Query(() => [Contact])
	async findAllContacts(): Promise<Contact[]> {
		return this.contactService.findAllContacts();
	}
}

