import { BaseEntity } from "./base.models";

export type UserLocation = any;

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
  username: string;
  gender: Gender | null;
  orientation: Orientation | null;
  age: number | null;
  bio: string | null;
  pictures_urls: string[];
  profile_picture_index: number | null;
  interests: string[];
  location: UserLocation | null;
  fame_score: number;
}

export interface AuthUser extends User {
  email: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  is_profile_complete: boolean;
}

export interface AuthUserWithPassword extends AuthUser {
  password: string; // hashed password
}

export type UserResult<T extends boolean> = T extends true
  ? AuthUserWithPassword | null
  : AuthUser | null;
