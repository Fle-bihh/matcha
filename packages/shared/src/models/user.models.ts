import { UserInterest } from "../constants";
import { BaseEntity } from "./base.models";
import { UserLocation } from "./location.models";

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
}

export interface AuthUser extends User {
  email: string;
  username: string;
  is_email_verified: boolean;
  is_profile_complete: boolean;
}

export interface AuthUserWithPassword extends AuthUser {
  password: string; // hashed password
}

export type UserResult<T extends boolean> = T extends true
  ? AuthUserWithPassword | null
  : AuthUser | null;
