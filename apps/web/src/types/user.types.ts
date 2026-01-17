import { User } from "@matcha/shared";

export interface StoreUser extends User {
	is_liked?: boolean;
}
