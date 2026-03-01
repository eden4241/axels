import { ProductBrand, ProductMaterial, ProductStatus, ProductType } from "../enums/product.enum";


export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productType: ProductType;
  productName: string;
  productPrice: number;
  productMaterial: ProductMaterial;
  productQuantity?: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productFragranceNotes?: string[];
  productVolumeMl?: number;
  productBrand?: ProductBrand;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productType?: ProductType;
  productMaterial?: ProductMaterial;
  productBrand?: ProductBrand;
  search?: string;
}

export interface ProductInput {
  productStatus: ProductStatus;
  productType: ProductType;
  productName: string;
  productPrice: number;
  productMaterial?: ProductMaterial;
  productQuantity?: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productFragranceNotes?: string[];
  productVolumeMl?: number;
  productBrand?: ProductBrand;
}

export interface ProductUpdateInput {
  _id: string;
  productStatus?: ProductStatus;
  productType?: ProductType;
  productName?: string;
  productPrice?: number;
  productMaterial?: ProductMaterial;
  productQuantity?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
  productFragranceNotes?: string[];
  productVolumeMl?: number;
  productBrand?: ProductBrand;
}
