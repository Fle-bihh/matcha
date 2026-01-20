import { createSelector } from "@reduxjs/toolkit";
import { EPagerKeys } from "@/constants";
import { EEntityTypes, TRootState } from "@/types";
import { selectPagerMeta } from "./pagination.selectors";
import { selectEntitiesByType } from "./entity.selectors";

export const selectMessagesByMatchId = (
	state: TRootState,
	matchId?: string,
) => {
	if (!matchId) return [];
	const messages = selectEntitiesByType(EEntityTypes.Messages)(state);
	return Object.values(messages).filter(
		(message) => message && message.match_id === parseInt(matchId, 10),
	);
};

export const selectMessagesMeta = createSelector(
	[selectPagerMeta(EPagerKeys.Messages)],
	(meta) => meta,
);

export const selectHasMoreMessages = createSelector(
	[selectMessagesMeta],
	(meta) => {
		if (!meta) return false;
		return meta.has_next_page;
	},
);
