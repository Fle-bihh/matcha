import { User } from "@matcha/shared";
import { TRootState, EEntityTypes, ELoaderKeys } from "@/types/store.types";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useFlagger } from "@/hooks/flags.hook";
import { EFlagKeys } from "@/types/flags.types";

const selectUsersEntity = (state: TRootState) =>
	state.entities[EEntityTypes.Users];

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
		(state: TRootState): boolean =>
			state.loaders[ELoaderKeys.fetchUsers] || false
	);
};

export const useUserStore = () => {
	const getUsers = useUsers();
	const isUsersLoading = useUsersLoading();
	const { data: userFetchedFlag } = useFlagger<EFlagKeys.UsersFetched>({
		flagger: EFlagKeys.UsersFetched,
	});

	return useMemo(
		() => ({
			getUsers,
			isUsersLoading,
			isUsersFetched: userFetchedFlag?.isFetched || false,
			hasUsersFetchError: !!userFetchedFlag?.error,
			userFetchError: userFetchedFlag?.error || null,
		}),
		[getUsers, isUsersLoading, userFetchedFlag]
	);
};
