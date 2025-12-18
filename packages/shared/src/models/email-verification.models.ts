import { BaseEntity } from "./base.models";

export interface EmailVerification extends BaseEntity {
	userId: string;
	verificationToken: string;
	isUsed: boolean;
	expiresAt: Date;
}
