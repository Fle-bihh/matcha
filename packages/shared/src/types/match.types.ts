import { PaginationParams } from "./api.types";

export interface MatchesFilters {
	unreadOnly?: boolean;
}

export interface MatchesParams extends PaginationParams, MatchesFilters {
	refresh?: boolean;
}
