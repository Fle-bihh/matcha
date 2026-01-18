import { useCallback } from "react";
import { useSelector } from "react-redux";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { MatchActions, selectAllEntities } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes, StoreUser } from "@/types";
import { MatchWithDetails, MatchesParams } from "@matcha/shared";
import { PaginationDto } from "@/types/api.types";
import { StoreMatch } from "@/types/match.types";

export function useMatches() {
	const { getMatches } = useDispatchActions({
		...MatchActions,
	});

	const allMatches = useSelector(
		selectAllEntities<StoreMatch>(EEntityTypes.Matches),
	);

	const buildParams = useCallback(
		(pagination: PaginationDto): MatchesParams => ({
			...pagination,
		}),
		[],
	);

	const pager = usePager<StoreMatch, MatchesParams>({
		pagerKey: EPagerKeys.Matches,
		entityType: EEntityTypes.Matches,
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
