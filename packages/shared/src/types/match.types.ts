import { PaginationParams } from "./api.types";

export interface MatchesFilters {
	unread_only?: boolean;
}

export interface MatchesParams extends PaginationParams, MatchesFilters {
	refresh?: boolean;
}
