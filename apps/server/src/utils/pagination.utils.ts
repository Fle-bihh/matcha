import { PaginatedResponse } from "@matcha/shared";

export function emptyPaginatedResponse<T, U = undefined>(
	limit: number,
): PaginatedResponse<T, U> {
	return {
		data: [],
		meta: {
			total: 0,
			page: 1,
			limit: limit,
			total_pages: 0,
			has_next_page: false,
			has_previous_page: false,
		},
	};
}
