import { User, UserStatus } from "@matcha/shared";

export interface StoreUser extends User {
	is_liked?: boolean;
	status?: UserStatus;
}
