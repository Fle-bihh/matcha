import { useCallback } from "react";
import { usePager } from "./pagination.hook";
import { useDispatchActions } from "./actions.hooks";
import { MessageActions } from "@/store";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import type { PaginationDto } from "@/types";

export function useMessages(matchId: string, loadPagerData = true) {
	const { getMessages, createMessage } = useDispatchActions({
		...MessageActions,
	});

	const buildParams = useCallback(
		(pagination: PaginationDto): { matchId: string } & PaginationDto => ({
			matchId,
			...pagination,
		}),
		[matchId],
	);

	const pager = usePager(EEntityTypes.Messages, {
		pagerKey: EPagerKeys.Messages,
		fn: getMessages,
		buildParams,
		// loadData: loadPagerData,
		loadData: false,
	});

	return {
		createMessage,
		fetchNextPage: pager.fetchNextPage,
		refresh: pager.refresh,
		hasNextPage: pager.hasNextPage,
		messages: pager.data,
	};
}
