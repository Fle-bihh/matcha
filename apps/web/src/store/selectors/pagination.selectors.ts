import { EPagerKeys } from "@/constants";
import { TRootState, EEntityTypes } from "@/types";
import { createSelector } from "@reduxjs/toolkit";
import { selectEntitiesByType } from "./entity.selectors";

export const selectPager = (pagerKey: EPagerKeys) => (state: TRootState) =>
	state.pagers[pagerKey];

export const selectPagerMeta = (pagerKey: EPagerKeys) =>
	createSelector([selectPager(pagerKey)], (pager) => pager?.meta);

export const selectPagerEntityKeys = (pagerKey: EPagerKeys) =>
	createSelector([selectPager(pagerKey)], (pager) => pager?.entityKeys || []);

export const selectPaginatedEntities = <T = any>(
	pagerKey: EPagerKeys,
	entityType: EEntityTypes
) =>
	createSelector(
		[selectPagerEntityKeys(pagerKey), selectEntitiesByType<T>(entityType)],
		(entityKeys, entities) => {
			if (!entities) return [];
			return entityKeys
				.map((key) => entities[key])
				.filter((entity): entity is T => entity !== undefined);
		}
	);

export const selectPaginatedData = <T = any>(
	pagerKey: EPagerKeys,
	entityType: EEntityTypes
) =>
	createSelector(
		[
			selectPaginatedEntities<T>(pagerKey, entityType),
			selectPagerMeta(pagerKey),
		],
		(data, meta) => ({
			data,
			meta,
		})
	);
