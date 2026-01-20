import { useSelector } from "react-redux";
import { selectPaginatedEntities, selectPagerMeta } from "@/store";
import { TPagerKey } from "@/constants";
import { EEntityTypes, IEntityTypeMap } from "@/types";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { PaginationDto } from "@/types";

interface IPagerHookOptions<TParams = PaginationDto> {
	pagerKey: TPagerKey;
	fn: (params: TParams) => void;
	loadData?: boolean;
	defaultLimit?: number;
	buildParams?: (pagination: PaginationDto) => TParams;
}

export function usePager<T extends EEntityTypes, TParams = PaginationDto>(
	entityType: T,
	{
		pagerKey,
		fn,
		loadData = true,
		defaultLimit = 10,
		buildParams,
	}: IPagerHookOptions<TParams>,
) {
	const hasLoaded = useRef(false);
	const data = useSelector(selectPaginatedEntities(pagerKey, entityType));
	const meta = useSelector(selectPagerMeta(pagerKey));

	const paramBuilder = useMemo(
		() => buildParams || ((params: PaginationDto) => params as TParams),
		[buildParams],
	);

	useEffect(() => {
		if (loadData && !hasLoaded.current) {
			hasLoaded.current = true;
			fn(paramBuilder({ page: 1, limit: defaultLimit }));
		}
	}, [fn, loadData, defaultLimit, paramBuilder]);

	const fetchPage = useCallback(
		(page: number, limit?: number) => {
			fn(
				paramBuilder({
					page,
					limit: limit ?? meta?.limit ?? defaultLimit,
				}),
			);
		},
		[fn, meta?.limit, defaultLimit, paramBuilder],
	);

	const fetchNextPage = useCallback(() => {
		if (meta?.has_next_page) {
			fetchPage(meta.page + 1);
		}
	}, [meta, fetchPage]);

	const fetchPreviousPage = useCallback(() => {
		if (meta?.has_previous_page) {
			fetchPage(meta.page - 1);
		}
	}, [meta, fetchPage]);

	const refresh = useCallback(() => {
		const currentLimit = meta?.limit ?? defaultLimit;
		fn(paramBuilder({ page: 1, limit: currentLimit, refresh: true }));
	}, [fn, meta?.limit, defaultLimit, paramBuilder]);

	const setLimit = useCallback(
		(newLimit: number) => {
			fn(paramBuilder({ page: 1, limit: newLimit }));
		},
		[fn, paramBuilder],
	);

	return {
		data: data as IEntityTypeMap[T][],
		meta,
		fetchPage,
		fetchNextPage,
		fetchPreviousPage,
		refresh,
		setLimit,
		hasNextPage: meta?.has_next_page ?? false,
		hasPreviousPage: meta?.has_previous_page ?? false,
	};
}
