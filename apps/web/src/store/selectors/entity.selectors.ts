import { TRootState, EEntityTypes, IEntityTypeMap } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

const selectEntityState = (state: TRootState) => state.entities;

export const selectEntitiesByType = <T extends EEntityTypes>(entityType: T) =>
	createSelector(
		[selectEntityState],
		(entities) =>
			(entities[entityType] || {}) as Record<
				string | number,
				IEntityTypeMap[T]
			>,
	);

export const selectEntityById = <T extends EEntityTypes>(
	entityType: T,
	id: string | number,
) =>
	createSelector(
		[selectEntitiesByType(entityType)],
		(entities) => entities[id] as IEntityTypeMap[T] | undefined,
	);

export const selectAllEntities = <T extends EEntityTypes>(entityType: T) =>
	createSelector([selectEntitiesByType(entityType)], (entities) =>
		Object.values(entities).filter(
			(entity): entity is IEntityTypeMap[T] => entity !== undefined,
		),
	);
