import { BaseEntity } from "./base.models";
import { Message } from "./message.models";
import { User } from "./user.models";

export interface Match extends BaseEntity {
	user1_id: number;
	user2_id: number;
}

export interface MatchWithDetails extends Match {
	other_user: User;
	last_message: Message | null;
}
