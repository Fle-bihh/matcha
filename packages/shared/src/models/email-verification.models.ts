import { BaseEntity } from "./base.models";

export interface EmailVerification extends BaseEntity {
  user_id: number;
  verification_token: string;
  is_used: boolean;
  is_new_email: boolean;
  new_email: string | null;
  expires_at: Date;
}
