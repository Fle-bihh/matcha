import { useCallback } from "react";
import { useSelector } from "react-redux";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { VisitActions, selectAllEntities } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import type { VisitWithVisitedUser } from "@matcha/shared";
import type { PaginationDto } from "@/types/api.types";

export function useVisits() {
	const { createVisit, getVisitsReceived } = useDispatchActions({
		...VisitActions,
	});

	const buildParams = useCallback(
		(pagination: PaginationDto): PaginationDto => ({
			...pagination,
		}),
		[]
	);

	const pager = usePager<VisitWithVisitedUser, PaginationDto>({
		pagerKey: EPagerKeys.Visits,
		entityType: EEntityTypes.Visits,
		fn: getVisitsReceived,
		buildParams,
		loadData: true,
	});

	return {
		createVisit,
		fetchNextPage: pager.fetchNextPage,
		refresh: pager.refresh,
		hasNextPage: pager.hasNextPage,
		visits: pager.data,
	};
}
