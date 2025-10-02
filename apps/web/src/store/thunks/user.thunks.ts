import { UserService } from "@/services/user.service";
import { EFlaggerKeys, EThunkFlaggerKeys, ETokens } from "@/types";
import { baseThunk } from "./base.thunks";

export const fetchUsersThunk = baseThunk<EThunkFlaggerKeys.FetchUsers>(
	EThunkFlaggerKeys.FetchUsers,
	async (container) => {
		const userService = container.get<UserService>(ETokens.UserService);
		await userService.getUsers();
	}
);
