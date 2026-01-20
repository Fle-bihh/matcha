import { PaginationParams } from "./api.types";

export interface MatchesFilters {}

export interface MatchesParams extends PaginationParams, MatchesFilters {
	refresh?: boolean;
}
