import { EThunkFlaggerKeys, ETokens } from "@/types";
import { baseThunk } from "./base.thunks";

export const registerThunk = baseThunk<EThunkFlaggerKeys.Register>(
	EThunkFlaggerKeys.Register,
	async (container) => {
		// const userService = container.get<UserService>(ETokens.UserService);
		// await userService.getUsers();
	}
);
