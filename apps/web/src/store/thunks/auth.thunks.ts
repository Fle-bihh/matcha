import { EThunkFlaggerKeys, ETokens } from "@/types";
import { baseThunk } from "./base.thunks";
import { AuthService } from "@/services/auth.service";
import { RegisterRequestDto } from "@matcha/shared";

export const registerThunk = (dto: RegisterRequestDto) =>
	baseThunk<EThunkFlaggerKeys.Register>(
		EThunkFlaggerKeys.Register,
		async (container) => {
			const authService = container.get<AuthService>(ETokens.AuthService);

			await authService.register(dto);
		}
	)();
