import { BaseEntity } from "./base.models";

export interface Message extends BaseEntity {
	id: number;
	sender_id: number;
	match_id: number;
	content: string;
	is_read: boolean;
}
