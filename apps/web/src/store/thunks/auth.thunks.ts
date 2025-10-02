import { EThunkFlaggerKeys, ETokens } from "@/types";
import { baseThunk } from "./base.thunks";
import { AuthService } from "@/services/auth.service";
import { logger } from "@matcha/shared";

export const registerThunk = baseThunk<EThunkFlaggerKeys.Register>(
	EThunkFlaggerKeys.Register,
	async (container) => {
		const authService = container.get<AuthService>(ETokens.AuthService);

		await authService.register({
			username: "test",
			password: "felix_123____",
			email: "test@test.test",
		});
	}
);
