import { ApiResponse, PaginationParams } from "@matcha/shared";

export interface ApiRequestResponse<T> extends ApiResponse<T> {
	status: number;
}

export interface PaginationDto extends PaginationParams {
	refresh?: boolean;
}
