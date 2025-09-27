import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/user.service";
import { ETokens } from "@/types/container.types";
import { setEntities } from "@/store/slices/entities.slice";
import { setLoader } from "@/store/slices/loaders.slice";
import { setFlag } from "@/store/slices/flags.slice";
import { EEntityTypes, EFlagKeys, ELoaderKeys } from "@/types/store.types";
import { Container } from "@/container/container";

export enum EUserThunks {
	FetchUsers = "users/fetchUsers",
}

export const fetchUsers = createAsyncThunk(
	EUserThunks.FetchUsers,
	async (_, { dispatch, rejectWithValue, extra }) => {
		try {
			dispatch(setLoader({ key: ELoaderKeys.fetchUsers, loading: true }));
			dispatch(setFlag({ key: EFlagKeys.UsersFetchError, value: false }));

			const { container } = extra as { container: Container };
			const userService = container.get<UserService>(ETokens.UserService);

			const users = await userService.getUsers();

			dispatch(
				setEntities({
					entityType: EEntityTypes.Users,
					entities: users,
				})
			);
			dispatch(setFlag({ key: EFlagKeys.UsersFetched, value: true }));
		} catch (error) {
			dispatch(setFlag({ key: EFlagKeys.UsersFetchError, value: true }));
			return rejectWithValue(error);
		} finally {
			dispatch(
				setLoader({ key: ELoaderKeys.fetchUsers, loading: false })
			);
		}
	}
);
