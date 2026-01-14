import { User } from "@matcha/shared";

export interface StoreUser extends User {
	isLiked?: boolean;
}
