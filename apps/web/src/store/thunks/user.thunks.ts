import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/user.service";
import { ETokens } from "@/types/container.types";
import { Container } from "@/container/container";

export enum EUserThunks {
	FetchUsers = "users/fetchUsers",
}

export const fetchUsers = createAsyncThunk(
	EUserThunks.FetchUsers,
	async (_, { rejectWithValue, extra }) => {
		try {
			const { container } = extra as { container: Container };
			const userService = container.get<UserService>(ETokens.UserService);

			await userService.getUsers();
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
