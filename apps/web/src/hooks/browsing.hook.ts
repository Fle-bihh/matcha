import { useSelector, useDispatch } from "react-redux";
import { usePager } from "./pagination.hook";
import { selectFilters } from "@/store/selectors/filters.selectors";
import { setFilters, clearFilters } from "@/store/slices/filters.slice";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { User, BrowsingFilters, BrowsingParams } from "@matcha/shared";
import { useAuthUser } from "./auth.hook";
import { useCallback } from "react";
import { PaginationDto } from "@/types/api.types";

const FILTER_KEY = "browsing";

export function useBrowsing() {
	const { getUsers } = useAuthUser();
	const dispatch = useDispatch();
	const filters = useSelector(selectFilters(FILTER_KEY));

	const buildParams = useCallback(
		(pagination: PaginationDto): BrowsingParams => ({
			...pagination,
			...(filters || {}),
		}),
		[filters]
	);

	const pager = usePager<User, BrowsingParams>({
		pagerKey: EPagerKeys.Users,
		entityType: EEntityTypes.Users,
		fn: getUsers,
		buildParams,
	});

	const updateFilters = useCallback(
		(newFilters: BrowsingFilters) => {
			dispatch(setFilters({ key: FILTER_KEY, filters: newFilters }));
		},
		[dispatch]
	);

	const clearBrowsingFilters = useCallback(() => {
		dispatch(clearFilters(FILTER_KEY));
	}, [dispatch]);

	const applyFilters = useCallback(
		(newFilters?: BrowsingFilters) => {
			const filtersToApply = newFilters || filters || {};

			dispatch(setFilters({ key: FILTER_KEY, filters: filtersToApply }));

			const currentLimit = pager.meta?.limit ?? 10;
			getUsers({
				page: 1,
				limit: currentLimit,
				refresh: true,
				...filtersToApply,
			});
		},
		[dispatch, filters, pager.meta?.limit, getUsers]
	);

	return {
		...pager,
		filters: filters || {},
		updateFilters,
		clearFilters: clearBrowsingFilters,
		applyFilters,
	};
}
