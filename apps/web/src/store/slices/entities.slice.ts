import { EEntityTypes, EStoreSlices } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sanitizeEntity, sanitizeEntities } from "@/utils/sanitization.utils";

export interface EntityState {
	[entityType: string]: { [id: string]: any };
}

const initialState: EntityState = {};

const entitiesSlice = createSlice({
	name: EStoreSlices.Entities,
	initialState,
	reducers: {
		setEntity: (
			state,
			action: PayloadAction<{
				entityType: EEntityTypes;
				id: string;
				entity: any;
			}>
		) => {
			const { entityType, id, entity } = action.payload;
			if (!state[entityType]) {
				state[entityType] = {};
			}
			state[entityType][id] = sanitizeEntity(entity);
		},
		patchEntity: (
			state,
			action: PayloadAction<{
				entityType: EEntityTypes;
				id: string;
				entity: any;
			}>
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
		setEntities: (
			state,
			action: PayloadAction<{
				entityType: EEntityTypes;
				entities: any[];
			}>
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
		clearEntities: (state) => {
			Object.keys(state).forEach((key) => {
				state[key] = {};
			});
		},
	},
});

export const { setEntity, setEntities, clearEntities, patchEntity } =
	entitiesSlice.actions;
export default entitiesSlice.reducer;
