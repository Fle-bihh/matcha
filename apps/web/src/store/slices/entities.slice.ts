import { EEntityTypes, EStoreSlices, IEntityTypeMap } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sanitizeEntity, sanitizeEntities } from "@/utils";

export interface EntityState {
	[entityType: string]: { [id: string]: unknown };
}

const initialState: EntityState = {};

const entitiesSlice = createSlice({
	name: EStoreSlices.Entities,
	initialState,
	reducers: {
		setEntity: <T extends EEntityTypes>(
			state: EntityState,
			action: PayloadAction<{
				entityType: T;
				id: string;
				entity: IEntityTypeMap[T];
			}>,
		) => {
			const { entityType, id, entity } = action.payload;
			if (!state[entityType]) {
				state[entityType] = {};
			}
			state[entityType][id] = sanitizeEntity(entity);
		},
		patchEntity: <T extends EEntityTypes>(
			state: EntityState,
			action: PayloadAction<{
				entityType: T;
				id: string;
				entity: Partial<IEntityTypeMap[T]>;
			}>,
		) => {
			const { entityType, id, entity } = action.payload;
			if (!state[entityType]) {
				state[entityType] = {};
			}
			const existingEntity = state[entityType][id] || {};
			state[entityType][id] = {
				...existingEntity,
				...sanitizeEntity(entity),
			};
		},
		setEntities: <T extends EEntityTypes>(
			state: EntityState,
			action: PayloadAction<{
				entityType: T;
				entities: IEntityTypeMap[T][];
			}>,
		) => {
			const { entityType, entities } = action.payload;
			if (!state[entityType]) {
				state[entityType] = {};
			}
			const sanitizedEntities = sanitizeEntities(entities);
			sanitizedEntities.forEach((entity) => {
				if (entity && typeof entity === "object" && "id" in entity) {
					state[entityType][entity.id] = entity;
				}
			});
		},
		setEntitiesStrict: <T extends EEntityTypes>(
			state: EntityState,
			action: PayloadAction<{
				entityType: T;
				entities: IEntityTypeMap[T][];
			}>,
		) => {
			const { entityType, entities } = action.payload;
			if (!state[entityType]) {
				state[entityType] = {};
			}
			const sanitizedEntities = sanitizeEntities(entities);
			const newEntitiesMap: { [id: string]: unknown } = {};
			sanitizedEntities.forEach((entity) => {
				if (entity && typeof entity === "object" && "id" in entity) {
					newEntitiesMap[entity.id] = entity;
				}
			});
			state[entityType] = newEntitiesMap;
		},
		deleteEntity: (
			state: EntityState,
			action: PayloadAction<{
				entityType: EEntityTypes;
				id: string;
			}>,
		) => {
			const { entityType, id } = action.payload;
			const entities = state[entityType];
			if (entities && entities[id]) {
				delete entities[id];
			}
		},
		clearEntities: (state: EntityState) => {
			Object.keys(state).forEach((key) => {
				state[key] = {};
			});
		},
	},
});

export const {
	setEntity,
	setEntities,
	clearEntities,
	patchEntity,
	deleteEntity,
	setEntitiesStrict,
} = entitiesSlice.actions;
export default entitiesSlice.reducer;
