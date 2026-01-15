import { useCallback } from "react";
import { useSelector } from "react-redux";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { MatchActions, selectAllEntities } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { MatchWithDetails, MatchesParams } from "@matcha/shared";
import { PaginationDto } from "@/types/api.types";

export function useMatches() {
	const { getMatches } = useDispatchActions({
		...MatchActions,
	});

	const allMatches = useSelector(
		selectAllEntities<MatchWithDetails>(EEntityTypes.Matches)
	);

	const buildParams = useCallback(
		(pagination: PaginationDto): MatchesParams => ({
			...pagination,
		}),
		[]
	);

	const pager = usePager<MatchWithDetails, MatchesParams>({
		pagerKey: EPagerKeys.Matches,
		entityType: EEntityTypes.Matches,
		fn: getMatches,
		buildParams,
		loadData: false,
	});

	return {
		...pager,
		matches: allMatches,
	};
}
