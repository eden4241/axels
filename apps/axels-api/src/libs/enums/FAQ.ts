import { registerEnumType } from '@nestjs/graphql';

export enum FAQCategory {
	GENERAL = 'GENERAL',
	FOR_BUYERS = 'FOR_BUYERS',
	FOR_STORES = 'FOR_STORES',
	MEMBERSHIP = 'MEMBERSHIP',
	COMMUNITY = 'COMMUNITY',
	PAYMENT = 'PAYMENT',
	PRODUCT = 'PRODUCT',
	OTHERS = 'OTHERS',
}

export enum FAQStatus {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}

registerEnumType(FAQCategory, { name: 'FAQCategory' });
registerEnumType(FAQStatus, { name: 'FAQStatus' });
