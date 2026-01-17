import { BaseEntity } from "./base.models";

export interface Visit extends BaseEntity {
	visitor_id: number;
	visited_id: number;
}
