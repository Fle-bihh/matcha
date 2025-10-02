import { User } from "@matcha/shared";
import {
	TRootState,
	EEntityTypes,
	EFlaggerKeys,
	TAppDispatch,
	EThunkFlaggerKeys,
} from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useFlagger } from "@/hooks/flaggers.hook";
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
	const { data: thunk } = useFlagger({
		flagger: EThunkFlaggerKeys.FetchUsers,
	});

	const fetchUsers = async () => {
		await dispatch(fetchUsersThunk());
	};

	return useMemo(
		() => ({
			users,
			fetchUsers,
			isUsersLoading: thunk?.isLoading || false,
			isUsersFetched: thunk?.success || false,
			hasUsersFetchError: !!thunk?.error,
			userFetchError: thunk?.error || null,
		}),
		[users, thunk]
	);
};
