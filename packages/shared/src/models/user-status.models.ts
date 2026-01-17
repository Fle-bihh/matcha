import { BaseEntity } from "./base.models";

export interface UserStatus extends BaseEntity {
	user_id: number;
	is_online: boolean;
	last_active_at: string;
}
