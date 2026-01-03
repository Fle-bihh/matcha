export type ApiResponse<T> = {
	message: string;
	data: T;
};

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: PaginationMeta;
}

export enum SortBy {
	Age = "age",
	Distance = "distance",
	FameRating = "fame_rating",
	CommonTags = "common_tags",
}

export enum SortOrder {
	Asc = "asc",
	Desc = "desc",
}

export interface BrowsingFilters {
	search?: string;
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
