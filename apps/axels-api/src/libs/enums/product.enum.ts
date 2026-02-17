import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	EARRING = 'EARRING',
	NECKLACE = 'NECKLACE',
	BRACELET = 'BRACELET',
	RING = 'RING',
	BROOCH = 'BROOCH',

}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductMaterial {
	GOLD = 'GOLD',
	PLATINUM = 'PLATINUM',
	SILVER = 'SILVER',
}
registerEnumType(ProductMaterial, {
	name: 'ProductMaterial',
});

export enum ProductBrand {
	ROLLIAGE = 'ROLLIAGE',
	HELEN_JAMES = 'HELEN JAMES',
	QKE_JEWELRY = 'QKE JEWELRY',
	ROMAN_PAUL = 'ROMAN PAUL',
	KS_SILVERWORKS = 'KS SILVERWORKS',
	LOVE_EXECUTIVE = 'LOVE EXECUTIVE',
}
registerEnumType(ProductBrand, {
	name: 'ProductBrand',
});

 export enum ProductSize {
	S = 'S',
	M = 'M',
	L = 'L',
	XS = 'XS',
	XL = 'XL',
	XXL = 'XXL',
 }
 registerEnumType(ProductSize, {
	name: 'ProductSize',
 });
