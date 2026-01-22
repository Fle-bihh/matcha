import { useCallback } from "react";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { VisitActions, selectAllEntities } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import type { VisitWithVisitedUser } from "@matcha/shared";
import type { PaginationDto } from "@/types";
import { useCounter } from "./counter.hook";
import { ECounterKeys } from "@/constants/counter.constants";

export function useVisits(loadPagerData = false) {
	const { createVisit, getVisitsReceived } = useDispatchActions({
		...VisitActions,
	});

	const buildParams = useCallback(
		(pagination: PaginationDto): PaginationDto => ({
			...pagination,
		}),
		[],
	);

	const pager = usePager(EEntityTypes.Visits, {
		pagerKey: EPagerKeys.Visits,
		fn: getVisitsReceived,
		buildParams,
		loadData: loadPagerData,
	});

	const visitsReceivedCount = useCounter(ECounterKeys.VisitsReceived);

	return {
		createVisit,
		fetchNextPage: pager.fetchNextPage,
		refresh: pager.refresh,
		hasNextPage: pager.hasNextPage,
		visits: pager.data,
		visitsReceivedCount,
	};
}
