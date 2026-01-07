import { BaseEntity } from "./base.models";

export interface Match extends BaseEntity {
	user1_id: number;
	user2_id: number;
}
