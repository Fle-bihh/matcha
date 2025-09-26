import { EEntityTypes, EStoreSlices } from "@/types/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
			state[entityType][id] = entity;
		},
		setEntities: (
			state,
			action: PayloadAction<{
				entityType: EEntityTypes;
				entities: any[];
			}>
		) => {
			const { entityType, entities } = action.payload;
			state[entityType] = {};
			entities.forEach((entity) => {
				if (entity && typeof entity === "object" && "id" in entity) {
					state[entityType][entity.id] = entity;
				}
			});
		},
	},
});

export const { setEntity, setEntities } = entitiesSlice.actions;
export default entitiesSlice.reducer;
