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
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface PaginatedResponse<T, U = undefined> {
	data: T[];
	extraData?: U;
	meta: PaginationMeta;
}

export enum SortOrder {
	Asc = "asc",
	Desc = "desc",
}

export const StatusCodes = HttpStatusCodes;
