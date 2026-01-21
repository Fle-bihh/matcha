import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { MessageActions } from "@/store";
import { getMessagesPagerKey } from "@/constants";
import { EEntityTypes } from "@/types";
import type { PaginationDto } from "@/types";

export function useMessages(matchId: string) {
	const { getMessages, createMessage } = useDispatchActions({
		...MessageActions,
	});

	const pagerKey = useMemo(() => getMessagesPagerKey(matchId), [matchId]);

	const hadLoadedRef = useRef(false);

	const buildParams = useCallback(
		(pagination: PaginationDto): { matchId: string } & PaginationDto => ({
			matchId,
			...pagination,
		}),
		[matchId],
	);

	const pager = usePager(EEntityTypes.Messages, {
		pagerKey,
		fn: getMessages,
		buildParams,
		loadData: false,
	});

	useEffect(() => {
		if (matchId && !hadLoadedRef.current && !pager.pagerExists) {
			hadLoadedRef.current = true;
			pager.refresh();
		}
	}, [pager.pagerExists, matchId, pager.refresh]);

	return {
		createMessage,
		fetchNextPage: pager.fetchNextPage,
		refresh: pager.refresh,
		hasNextPage: pager.hasNextPage,
		messages: pager.data,
	};
}
