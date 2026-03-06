import { Module } from '@nestjs/common';
import { FaqResolver } from './faq.resolver';
import { FaqService } from './faq.service';
import { MongooseModule } from '@nestjs/mongoose';
import FAQSchema from '../../schemas/FAQ.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FAQ', schema: FAQSchema }]), AuthModule],
  providers: [FaqResolver, FaqService]
})
export class FaqModule {}
