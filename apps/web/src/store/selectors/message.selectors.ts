import { createSelector } from "@reduxjs/toolkit";
import { EPagerKeys } from "@/constants";
import { EEntityTypes, TRootState } from "@/types";
import { selectPagerMeta } from "./pagination.selectors";
import { selectEntitiesByType } from "./entity.selectors";

export const selectMessagesByMatchId = (matchId?: string) =>
	createSelector(
		[selectEntitiesByType(EEntityTypes.Messages)],
		(messages) => {
			if (!matchId) return [];
			return Object.values(messages).filter(
				(message) =>
					message && message.match_id === parseInt(matchId, 10),
			);
		},
	);

export const selectHasMoreMessages = createSelector(
	[selectPagerMeta(EPagerKeys.Messages)],
	(meta) => {
		if (!meta) return false;
		return meta.has_next_page;
	},
);
