import { Match } from "@matcha/shared";

export interface StoreMatch extends Match {
	unread_messages_count: number;
}
