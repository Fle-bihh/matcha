import { UserService } from "@/services/user.service";
import { EFlaggerKeys, ETokens } from "@/types";
import { baseThunk } from "./base.thunks";

export const fetchUsersThunk = baseThunk<EFlaggerKeys.FetchUsersThunk>(
	EFlaggerKeys.FetchUsersThunk,
	async (container) => {
		const userService = container.get<UserService>(ETokens.UserService);
		await userService.getUsers();
	}
);
