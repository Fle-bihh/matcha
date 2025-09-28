import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/user.service";
import { ETokens } from "@/types";
import { Container } from "@/container/Container";
import { baseThunk } from "./base.thunks";

export enum EUserThunks {
	FetchUsers = "users/fetchUsers",
}

export const fetchUsers = baseThunk<EUserThunks>(
	EUserThunks.FetchUsers,
	async (container) => {
		const userService = container.get<UserService>(ETokens.UserService);
		await userService.getUsers();
	}
);
