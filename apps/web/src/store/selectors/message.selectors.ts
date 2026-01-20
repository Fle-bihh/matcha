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

export const selectLastMessageByMatchId = (matchId?: string | number) =>
	createSelector(
		[selectEntitiesByType(EEntityTypes.Messages)],
		(messages) => {
			if (!matchId) return undefined;
			const matchMessages = Object.values(messages).filter(
				(message) =>
					message &&
					message.match_id === parseInt(matchId.toString(), 10),
			);
			if (matchMessages.length === 0) return undefined;
			return matchMessages.reduce((latest, current) =>
				new Date(current.created_at) > new Date(latest.created_at)
					? current
					: latest,
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
