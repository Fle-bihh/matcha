import { BaseEntity } from "./base.models";

export interface Block extends BaseEntity {
	blocker_id: number;
	blocked_id: number;
}
