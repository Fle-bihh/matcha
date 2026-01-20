import { BaseEntity } from "./base.models";

export interface Like extends BaseEntity {
	liker_id: number;
	liked_id: number;
}
