import { BaseEntity } from "./base.models";

export interface EmailVerification extends BaseEntity {
  userId: number;
  verificationToken: string;
  isUsed: boolean;
  expiresAt: Date;
}
