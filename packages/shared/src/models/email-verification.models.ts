import { BaseEntity } from "./base.models";

export interface EmailVerification extends BaseEntity {
  user_id: number;
  verification_token: string;
  is_used: boolean;
  expires_at: Date;
}
