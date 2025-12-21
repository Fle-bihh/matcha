import { BaseEntity } from "./base.models";

export interface PasswordReset extends BaseEntity {
  user_id: number;
  reset_token: string;
  is_used: boolean;
  expires_at: Date;
}
