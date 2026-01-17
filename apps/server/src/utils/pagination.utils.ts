import { PaginatedResponse } from "@matcha/shared";

export function emptyPaginatedResponse<T, U = undefined>(
	limit: number
): PaginatedResponse<T, U> {
	return {
		data: [],
		meta: {
			total: 0,
			page: 1,
			limit: limit,
			totalPages: 0,
			hasNextPage: false,
			hasPreviousPage: false,
		},
	};
}
