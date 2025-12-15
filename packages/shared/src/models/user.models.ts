import { BaseEntity } from "./base.models";

export interface User extends BaseEntity {
	username: string;
}

export interface AuthUser extends BaseEntity {
	email: string;
	username: string;
	first_name: string;
	last_name: string;
}

export interface UserWithPassword extends AuthUser {
	password: string; // hashed password
}
