import { BaseEntity } from "./base.models";

export interface Notification extends BaseEntity {
	user_id: number;
	content: string;
}
