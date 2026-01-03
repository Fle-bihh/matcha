import { AuthUser, BrowsingFilters } from "@matcha/shared";

export enum EStorageKeys {
	AccessToken = "access_token",
	RefreshToken = "refresh_token",
	BrowsingFilters = "browsing_filters",
}

export type StorageDataType = {
	[EStorageKeys.AccessToken]: string | null;
	[EStorageKeys.RefreshToken]: string | null;
	[EStorageKeys.BrowsingFilters]: BrowsingFilters | null;
};
