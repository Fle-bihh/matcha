import { AuthUser } from "@matcha/shared";

export enum EStorageKeys {
	AccessToken = "access_token",
	RefreshToken = "refresh_token",
	User = "user",
}

export type StorageDataType = {
	[EStorageKeys.AccessToken]: string | null;
	[EStorageKeys.RefreshToken]: string | null;
	[EStorageKeys.User]: AuthUser | null;
};
