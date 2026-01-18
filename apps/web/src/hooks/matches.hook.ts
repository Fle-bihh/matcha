import { useCallback } from "react";
import { useSelector } from "react-redux";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { MatchActions, selectAllEntities } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes, PaginationDto, StoreMatch, StoreUser } from "@/types";
import { MatchWithDetails, MatchesParams } from "@matcha/shared";

export function useMatches() {
	const { getMatches } = useDispatchActions({
		...MatchActions,
	});

	const allMatches = useSelector(selectAllEntities(EEntityTypes.Matches));

	const buildParams = useCallback(
		(pagination: PaginationDto): MatchesParams => ({
			...pagination,
		}),
		[],
	);

	const pager = usePager(EEntityTypes.Matches, {
		pagerKey: EPagerKeys.Matches,
		fn: getMatches,
		buildParams,
		loadData: false,
	});

	return {
		fetchNextPage: pager.fetchNextPage,
		refresh: pager.refresh,
		hasNextPage: pager.hasNextPage,
		matches: allMatches,
	};
}
