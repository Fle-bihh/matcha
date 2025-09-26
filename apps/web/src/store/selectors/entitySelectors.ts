import { EEntityTypes } from "@/types/entities";
import { IContainer } from "@/types/container";
import { User } from "@matcha/shared";

export const createEntitySelectors = (container: IContainer) => {
	return {
		getEntity: <T>(entityType: EEntityTypes, id: string): T | undefined => {
			const state = container.store.getState();
			return state.entities[entityType]?.[id] as T;
		},

		getEntities: <T>(entityType: EEntityTypes): T[] => {
			const state = container.store.getState();
			const entityMap = state.entities[entityType];
			return entityMap ? (Object.values(entityMap) as T[]) : [];
		},

		getUsers: (): User[] => {
			const state = container.store.getState();
			const entityMap = state.entities[EEntityTypes.USER];
			return entityMap ? (Object.values(entityMap) as User[]) : [];
		},

		getUserById: (id: string): User | undefined => {
			const state = container.store.getState();
			return state.entities[EEntityTypes.USER]?.[id] as User;
		},
	};
};
