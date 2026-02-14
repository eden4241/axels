import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	SELLER = 'SELLER',
	ADMIN = 'ADMIN',
}
registerEnumType(MemberType, { name: 'MemberType' });

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}
registerEnumType(MemberStatus, { name: 'MemberStatus' });

export enum MemberAuthType {
	EMAIL = 'EMAIL',
	PHONE = 'PHONE',
	TELEGRAM = 'TELEGRAM',
}
registerEnumType(MemberAuthType, { name: 'MemberAuthType' });