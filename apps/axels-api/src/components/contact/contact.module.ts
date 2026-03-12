import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ContactSchema from '../../schemas/Contact.model';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }])],
	providers: [ContactResolver, ContactService],
})
export class ContactModule {}

