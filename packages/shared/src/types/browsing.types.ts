import { PaginationParams, SortOrder } from "./api.types";

export enum BrowsingSortBy {
	Age = "age",
	Distance = "distance",
	FameRating = "fame_rating",
	CommonTags = "common_tags",
}

export interface BrowsingFilters {
	age_min?: number;
	age_max?: number;
	distance_max?: number;
	fame_min?: number;
	fame_max?: number;
	interests?: string[];
	sort_by?: BrowsingSortBy;
	sort_order?: SortOrder;
}

export interface BrowsingParams extends PaginationParams, BrowsingFilters {
	refresh?: boolean;
}
