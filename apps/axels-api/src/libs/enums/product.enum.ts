import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	RING = 'RING',
	NECKLACE = 'NECKLACE',
	EARRING = 'EARRING',
	BRACELET = 'BRACELET',
	DIAMOND = 'DIAMOND',
	GIFT = 'GIFT',
	WEDDING_RING = 'WEDDING_RING',
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
	SILVER = 'SILVER',
	PLATINUM = 'PLATINUM',
	WHITE_GOLD = 'WHITE_GOLD',
	ROSE_GOLD = 'ROSE_GOLD',
	STERLING_SILVER = 'STERLING_SILVER',
	DIAMOND = 'DIAMOND',
	GEMSTONE = 'GEMSTONE',
	PEARL = 'PEARL',
	TITANIUM = 'TITANIUM',
	BRONZE = 'BRONZE',
	CRYSTAL = 'CRYSTAL',
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
	CARTIER = 'CARTIER',
	BVLGARI = 'BVLGARI',
	TIFFANY = 'TIFFANY',
	VAANCLEEF = 'VAANCLEEF',
	GRAFF = 'GRAFF',
	HARRY_WINSTON = 'HARRY WINSTON',
	PANDORA = 'PANDORA',
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
