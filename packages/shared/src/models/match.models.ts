import { BaseEntity } from "./base.models";
import { Message } from "./message.models";
import { User } from "./user.models";

export interface Match extends BaseEntity {
	user1_id: number;
	user2_id: number;
	unread_messages_count_user1: number;
	unread_messages_count_user2: number;
}

export interface MatchWithDetails extends Match {
	other_user: User;
	last_message: Message | null;
	unread_conversations_count: number;
}
