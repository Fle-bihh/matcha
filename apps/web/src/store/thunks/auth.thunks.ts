import { EThunkFlaggerKeys, ETokens } from "@/types";
import { baseThunk } from "./base.thunks";
import { AuthService } from "@/services/auth.service";
import { LoginRequestDto, RegisterRequestDto } from "@matcha/shared";

export const registerThunk = (dto: RegisterRequestDto) =>
	baseThunk<EThunkFlaggerKeys.Register>(
		EThunkFlaggerKeys.Register,
		async (container) => {
			const authService = container.get<AuthService>(ETokens.AuthService);

			await authService.register(dto);
		}
	)();

export const authenticateThunk = () =>
	baseThunk<EThunkFlaggerKeys.Authenticate>(
		EThunkFlaggerKeys.Authenticate,
		async (container) => {
			const authService = container.get<AuthService>(ETokens.AuthService);

			await authService.authenticate();
		}
	)();

export const logoutThunk = () =>
	baseThunk<EThunkFlaggerKeys.Logout>(
		EThunkFlaggerKeys.Logout,
		async (container) => {
			const authService = container.get<AuthService>(ETokens.AuthService);

			await authService.logout();
		}
	)();

export const loginThunk = (dto: LoginRequestDto) =>
	baseThunk<EThunkFlaggerKeys.Login>(
		EThunkFlaggerKeys.Login,
		async (container) => {
			const authService = container.get<AuthService>(ETokens.AuthService);

			await authService.login(dto);
		}
	)();
