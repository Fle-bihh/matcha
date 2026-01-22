import { UserInterest } from "../constants";
import { BaseEntity } from "./base.models";
import { UserLocation } from "../types";

export enum Gender {
	Male = "male",
	Female = "female",
	Other = "other",
}

export enum Orientation {
	Heterosexual = "heterosexual",
	Homosexual = "homosexual",
	Bisexual = "bisexual",
}

export enum UserVerificationStatus {
	Unverified = "unverified",
	Pending = "pending",
	Verified = "verified",
	Rejected = "rejected",
}

export interface User extends BaseEntity {
	first_name: string;
	last_name: string;
	gender: Gender | null;
	orientation: Orientation | null;
	age: number | null;
	bio: string | null;
	pictures_urls: string[] | null;
	interests: UserInterest[] | null;
	location: UserLocation | null;
	fame_score: number;
	is_profile_verified: boolean;
}

export interface AuthUser extends User {
	email: string;
	username: string;
	is_email_verified: boolean;
	is_profile_complete: boolean;
	is_admin: boolean;
	verification_status: UserVerificationStatus;
}

export interface AuthUserWithPassword extends AuthUser {
	password: string;
}

export type UserResult<T extends boolean> = T extends true
	? AuthUserWithPassword | null
	: AuthUser | null;
