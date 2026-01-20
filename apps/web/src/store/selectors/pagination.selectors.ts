import { EPagerKeys } from "@/constants";
import { TRootState, EEntityTypes, IEntityTypeMap } from "@/types";
import { createSelector } from "@reduxjs/toolkit";
import { selectEntitiesByType } from "./entity.selectors";

export const selectPager = (pagerKey: EPagerKeys) => (state: TRootState) =>
	state.pagers[pagerKey];

export const selectPagerMeta = (pagerKey: EPagerKeys) =>
	createSelector([selectPager(pagerKey)], (pager) => pager?.meta);

export const selectPagerEntityKeys = (pagerKey: EPagerKeys) =>
	createSelector([selectPager(pagerKey)], (pager) => pager?.entityKeys || []);

export const selectPaginatedEntities = <T extends EEntityTypes>(
	pagerKey: EPagerKeys,
	entityType: T,
) =>
	createSelector(
		[selectPagerEntityKeys(pagerKey), selectEntitiesByType(entityType)],
		(entityKeys, entities) => {
			if (!entities) return [];
			return entityKeys
				.map((key) => entities[key])
				.filter(
					(entity): entity is IEntityTypeMap[T] =>
						entity !== undefined,
				);
		},
	);

export const selectPaginatedData = <T extends EEntityTypes>(
	pagerKey: EPagerKeys,
	entityType: T,
) =>
	createSelector(
		[
			selectPaginatedEntities(pagerKey, entityType),
			selectPagerMeta(pagerKey),
		],
		(data, meta) => ({
			data,
			meta,
		}),
	);
