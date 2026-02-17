import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { Product } from '../../libs/dto/product/product';
import { Message } from '../../libs/enums/common.enum';
import { ProductInput } from '../../libs/dto/product/product.input';
import { MemberService } from '../member/member.service';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private authService: AuthService,
		private viewService: ViewService,
		private memberService: MemberService,
	) {}

	public async createProduct(input: ProductInput): Promise<Product> {
		try {
			const result = await this.productModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProducts',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
