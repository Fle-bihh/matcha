import { PaginationParams, SortOrder } from "./api.types";

export enum BrowsingSortBy {
	Age = "age",
	Distance = "distance",
	FameRating = "fame_rating",
	CommonTags = "common_tags",
}

export interface BrowsingFilters {
	ageMin?: number;
	ageMax?: number;
	distanceMax?: number;
	fameMin?: number;
	fameMax?: number;
	interests?: string[];
	sortBy?: BrowsingSortBy;
	sortOrder?: SortOrder;
}

export interface BrowsingParams extends PaginationParams, BrowsingFilters {
	refresh?: boolean;
}
