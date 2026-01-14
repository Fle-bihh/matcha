import { TRootState, EEntityTypes } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

const selectEntityState = (state: TRootState) => state.entities;

export const selectEntitiesByType = <T = any>(entityType: EEntityTypes) =>
	createSelector(
		[selectEntityState],
		(entities) => (entities[entityType] || {}) as Record<string | number, T>
	);

export const selectEntityById = <T = any>(
	entityType: EEntityTypes,
	id: string | number
) =>
	createSelector(
		[selectEntitiesByType<T>(entityType)],
		(entities) => entities[id] as T | undefined
	);

export const selectAllEntities = <T = any>(entityType: EEntityTypes) =>
	createSelector([selectEntitiesByType<T>(entityType)], (entities) =>
		Object.values(entities).filter(
			(entity): entity is T => entity !== undefined
		)
	);
