import { TRootState, EEntityTypes } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

export const selectPager = (pagerKey: string) => (state: TRootState) =>
  state.pagers[pagerKey];

export const selectPagerMeta = (pagerKey: string) =>
  createSelector([selectPager(pagerKey)], (pager) => pager?.meta);

export const selectPagerEntityKeys = (pagerKey: string) =>
  createSelector([selectPager(pagerKey)], (pager) => pager?.entityKeys || []);

export const selectPaginatedEntities = <T = any>(
  pagerKey: string,
  entityType: EEntityTypes
) =>
  createSelector(
    [
      selectPagerEntityKeys(pagerKey),
      (state: TRootState) => state.entities[entityType],
    ],
    (entityKeys, entities) => {
      if (!entities) return [];
      return entityKeys
        .map((key) => entities[key])
        .filter((entity): entity is T => entity !== undefined);
    }
  );

export const selectPaginatedData = <T = any>(
  pagerKey: string,
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
