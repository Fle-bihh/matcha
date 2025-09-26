import { IContainer } from "@/types/container";

export const createLoaderSelectors = (container: IContainer) => {
	return {
		isLoading: (key: string): boolean => {
			const state = container.store.getState();
			return state.loaders[key] || false;
		},

		isUsersLoading: (): boolean => {
			const state = container.store.getState();
			return state.loaders["users"] || false;
		},

		isUserLoading: (userId: string): boolean => {
			const state = container.store.getState();
			return state.loaders[`user-${userId}`] || false;
		},
	};
};
