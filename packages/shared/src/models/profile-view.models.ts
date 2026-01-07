import { BaseEntity } from "./base.models";

export interface ProfileView extends BaseEntity {
	viewer_id: number;
	viewed_id: number;
}
