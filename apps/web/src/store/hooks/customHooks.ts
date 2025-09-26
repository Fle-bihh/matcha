import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { User } from "@matcha/shared";

export const useUsers = () => {
	return useSelector((state: RootState): User[] => {
		const usersEntity = state.entities.USER;
		return usersEntity ? Object.values(usersEntity) : [];
	});
};

export const useUserById = (id: string): User | undefined => {
	return useSelector((state: RootState) => {
		return state.entities.USER?.[id];
	});
};

export const useUsersLoading = () => {
	return useSelector(
		(state: RootState): boolean => state.loaders.users || false
	);
};

export const useUsersFetched = () => {
	return useSelector(
		(state: RootState): boolean => state.flags.usersFetched || false
	);
};

export const useUsersFetchError = () => {
	return useSelector(
		(state: RootState): boolean => state.flags.usersFetchError || false
	);
};

export const useUserStore = () => {
	const getUsers = useUsers();
	const isUsersLoading = useUsersLoading();
	const isUsersFetched = useUsersFetched();
	const hasUsersFetchError = useUsersFetchError();

	return {
		getUsers,
		getUserById: useUserById,
		isUsersLoading,
		isUsersFetched,
		hasUsersFetchError,
	};
};
