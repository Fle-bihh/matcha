import { StatusCodes as HttpStatusCodes } from "http-status-codes";

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
	total_pages: number;
	has_next_page: boolean;
	has_previous_page: boolean;
}

export interface PaginatedResponse<T, U = undefined> {
	data: T[];
	extra_data?: U;
	meta: PaginationMeta;
}

export enum SortOrder {
	Asc = "asc",
	Desc = "desc",
}

export const StatusCodes = HttpStatusCodes;
