import { User, UserStatus } from "@matcha/shared";

export interface StoreUser extends User {
	status?: UserStatus;

	is_liked?: boolean;
	has_liked_you?: boolean;
	is_matched?: boolean;
	is_reported?: boolean;
}
