import { User } from "@matcha/shared";
import {
	TRootState,
	EEntityTypes,
	ELoaderKeys,
	EFlaggerKeys,
	TAppDispatch,
} from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useFlagger } from "@/hooks/flaggers.hook";
import { useLoaders } from "@/hooks/loaders.hook";
import { fetchUsersThunk } from "@/store";

const selectUsersEntity = (state: TRootState) =>
	state.entities[EEntityTypes.Users];

const selectUsers = createSelector(
	[selectUsersEntity],
	(usersEntity): User[] => {
		return usersEntity ? Object.values(usersEntity) : [];
	}
);

export const useUser = () => {
	const dispatch = useDispatch<TAppDispatch>();
	const users = useSelector(selectUsers);
	const { isLoading: isUsersLoading } = useLoaders({
		loaders: [ELoaderKeys.fetchUsers],
	});
	const { data: userFetchedFlag } = useFlagger<EFlaggerKeys.UsersFetched>({
		flagger: EFlaggerKeys.UsersFetched,
	});

	const fetchUsers = async () => {
		await dispatch(fetchUsersThunk());
	};

	return useMemo(
		() => ({
			users,
			fetchUsers,
			isUsersLoading,
			isUsersFetched: userFetchedFlag?.isFetched || false,
			hasUsersFetchError: !!userFetchedFlag?.error,
			userFetchError: userFetchedFlag?.error || null,
		}),
		[users, isUsersLoading, userFetchedFlag]
	);
};
