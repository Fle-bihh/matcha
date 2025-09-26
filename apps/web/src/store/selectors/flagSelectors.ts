import { IContainer } from "@/types/container";

export const createFlagSelectors = (container: IContainer) => {
	return {
		getFlag: (key: string): boolean => {
			const state = container.store.getState();
			return state.flags[key] || false;
		},

		isUsersFetched: (): boolean => {
			const state = container.store.getState();
			return state.flags["usersFetched"] || false;
		},

		hasUsersFetchError: (): boolean => {
			const state = container.store.getState();
			return state.flags["usersFetchError"] || false;
		},
	};
};
