import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@matcha/shared";
import { Container } from "@/container/Container";
import { UserService } from "@/services/UserService";
import { ETokens } from "@/types/container";
import { setEntities } from "@/store/slices/entitiesSlice";
import { setLoader } from "@/store/slices/loadersSlice";
import { setFlag } from "@/store/slices/flagsSlice";
import { EEntityTypes } from "@/types/entities";

export const fetchUsers = createAsyncThunk(
	"users/fetchUsers",
	async (_, { dispatch, rejectWithValue, extra }) => {
		try {
			dispatch(setLoader({ key: "users", loading: true }));
			dispatch(setFlag({ key: "usersFetchError", value: false }));

			// Le container est passé dans extra via le middleware thunk
			const { container } = extra as { container: Container };
			const userService = container.get<UserService>(ETokens.UserService);

			// Le service ne gère plus le state, il retourne juste les données
			const users = await userService.getUsers();

			dispatch(
				setEntities({
					entityType: EEntityTypes.USER,
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

export const fetchUserById = createAsyncThunk(
	"users/fetchUserById",
	async (userId: string, { dispatch, rejectWithValue, extra }) => {
		try {
			dispatch(setLoader({ key: `user-${userId}`, loading: true }));

			const { container } = extra as { container: Container };
			const userService = container.get<UserService>(ETokens.UserService);

			const user = await userService.getUserById(userId);

			if (user) {
				dispatch(
					setEntities({
						entityType: EEntityTypes.USER,
						entities: [user],
					})
				);
			}

			return user;
		} catch (error) {
			return rejectWithValue(error);
		} finally {
			dispatch(setLoader({ key: `user-${userId}`, loading: false }));
		}
	}
);
