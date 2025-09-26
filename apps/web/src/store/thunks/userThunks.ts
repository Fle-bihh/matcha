import { createAsyncThunk } from "@reduxjs/toolkit";
import { Container } from "@/container/Container";
import { UserService } from "@/services/UserService";
import { ETokens } from "@/types/container";
import { setEntities } from "@/store/slices/entitiesSlice";
import { setLoader } from "@/store/slices/loadersSlice";
import { setFlag } from "@/store/slices/flagsSlice";
import { EEntityTypes } from "@/types/store";

export const fetchUsers = createAsyncThunk(
	"users/fetchUsers",
	async (_, { dispatch, rejectWithValue, extra }) => {
		try {
			dispatch(setLoader({ key: "users", loading: true }));
			dispatch(setFlag({ key: "usersFetchError", value: false }));

			const { container } = extra as { container: Container };
			const userService = container.get<UserService>(ETokens.UserService);

			const users = await userService.getUsers();

			dispatch(
				setEntities({
					entityType: EEntityTypes.User,
					entities: users,
				})
			);
			dispatch(setFlag({ key: "usersFetched", value: true }));

			return users;
		} catch (error) {
			dispatch(setFlag({ key: "usersFetchError", value: true }));
			return rejectWithValue(error);
		} finally {
			dispatch(setLoader({ key: "users", loading: false }));
		}
	}
);
