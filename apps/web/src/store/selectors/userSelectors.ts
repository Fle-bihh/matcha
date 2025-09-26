import { logger, User } from "@matcha/shared";
import { TRootState, EEntityTypes } from "@/types/store";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";

const selectUsersEntity = (state: TRootState) =>
	state.entities[EEntityTypes.User];

const selectUsers = createSelector(
	[selectUsersEntity],
	(usersEntity): User[] => {
		return usersEntity ? Object.values(usersEntity) : [];
	}
);

export const useUsers = () => {
	return useSelector(selectUsers);
};

export const useUsersLoading = () => {
	return useSelector(
		(state: TRootState): boolean => state.loaders.users || false
	);
};

export const useUsersFetched = () => {
	return useSelector(
		(state: TRootState): boolean => state.flags.usersFetched || false
	);
};

export const useUsersFetchError = () => {
	return useSelector(
		(state: TRootState): boolean => state.flags.usersFetchError || false
	);
};

export const useUserStore = () => {
	const getUsers = useUsers();
	const isUsersLoading = useUsersLoading();
	const isUsersFetched = useUsersFetched();
	const hasUsersFetchError = useUsersFetchError();

	return useMemo(
		() => ({
			getUsers,
			isUsersLoading,
			isUsersFetched,
			hasUsersFetchError,
		}),
		[getUsers, isUsersLoading, isUsersFetched, hasUsersFetchError]
	);
};
