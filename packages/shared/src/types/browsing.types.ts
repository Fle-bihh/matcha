import { PaginationParams, SortBy, SortOrder } from "./api.types";

export interface BrowsingFilters {
	ageMin?: number;
	ageMax?: number;
	distanceMax?: number;
	fameMin?: number;
	fameMax?: number;
	interests?: string[];
	sortBy?: SortBy;
	sortOrder?: SortOrder;
}

export interface BrowsingParams extends PaginationParams, BrowsingFilters {
	refresh?: boolean;
}
