import { BaseEntity } from "./base.models";

export interface Report extends BaseEntity {
	reporter_id: number;
	reported_id: number;
	reason?: string;
}
