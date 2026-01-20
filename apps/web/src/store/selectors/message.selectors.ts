import { createSelector } from "@reduxjs/toolkit";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { selectPaginatedData, selectPagerMeta } from "./pagination.selectors";

export const selectMessages = createSelector(
	[selectPaginatedData(EPagerKeys.Messages, EEntityTypes.Messages)],
	({ data }) => data,
);

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
