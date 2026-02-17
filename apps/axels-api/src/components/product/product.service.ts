import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as moment from 'moment';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { Product, Products } from '../../libs/dto/product/product';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ProductInput, ProductsInquiry, SellerProductsInquiry } from '../../libs/dto/product/product.input';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import { lookupMember, shapeIntoMongooseObject } from '../../libs/config';

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

	public async getProduct(memberId: ObjectId, productId: ObjectId): Promise<Product> {
		const search: T = {
			_id: productId,
			productStatus: ProductStatus.ACTIVE,
		};

		const targetProduct: Product = await this.productModel.findOne(search).lean().exec();
		if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: productId, viewGroup: ViewGroup.PRODUCT };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.productStatsEditor({ _id: productId, targetKey: 'productViews', modifier: 1 });
				targetProduct.productViews++;
			}

			//meLiked++
		}
		targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
		return targetProduct;
	}

	public async updateProduct(memberId: ObjectId, input: ProductUpdate): Promise<Product> {
		let { productStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			productStatus: ProductStatus.ACTIVE,
		};

		if (productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
		else if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.productModel.findByIdAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberProducts',
				modifier: -1,
			});
		}
		return result;
	}

	public async getProducts(memberId: ObjectId, input: ProductsInquiry): Promise<Products> {
		const match: T = { productStatus: ProductStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							//meLiked++
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	private shapeMatchQuery(match: T, input: ProductsInquiry): void {
		const { memberId, typeList, brandList, materialList, sizeList, priceRange, text } = input.search;

		if (memberId) match.memberId = shapeIntoMongooseObject(memberId);
		if (typeList) match.productType = { $in: typeList };
		if (brandList) match.productBrand = { $in: brandList };
		if (materialList) match.productMaterial = { $in: materialList };
		if (sizeList) match.productSize = { $in: sizeList };

		if (priceRange) match.productPrice = { $gte: priceRange.start, $lte: priceRange.end };

		if (text) match.productTitle = { $regex: new RegExp(text, 'i') };
	}

	public async getSellerProducts(memberId: ObjectId, input: SellerProductsInquiry): Promise<Products> {
		const { productStatus } = input.search;
		if (productStatus === ProductStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			productStatus: productStatus ?? { $ne: ProductStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async productStatsEditor(input: StatisticModifier): Promise<Product> {
		const { targetKey, modifier, _id } = input;
		return await this.productModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
