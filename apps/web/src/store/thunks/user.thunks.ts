import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/user.service";
import { ETokens } from "@/types/container.types";
import { Container } from "@/container/container";
import { baseThunk } from "./base.thunks";

export enum EUserThunks {
	FetchUsers = "users/fetchUsers",
}

export const fetchUsers = baseThunk<EUserThunks>(
	EUserThunks.FetchUsers,
	async (container) => {
		const userService = container.get<UserService>(ETokens.UserService);
		return await userService.getUsers();
	}
);
