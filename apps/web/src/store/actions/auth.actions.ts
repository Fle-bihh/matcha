import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";
import { LoginRequestDto, RegisterRequestDto } from "@matcha/shared";

const authActionsConfig = {
	[EActionKeys.Register]: {
		serviceToken: ETokens.AuthService,
		methodName: "register",
	},
	[EActionKeys.Authenticate]: {
		serviceToken: ETokens.AuthService,
		methodName: "authenticate",
	},
	[EActionKeys.Logout]: {
		serviceToken: ETokens.AuthService,
		methodName: "logout",
	},
	[EActionKeys.Login]: {
		serviceToken: ETokens.AuthService,
		methodName: "login",
	},
} as const;

const authActions = createActions(authActionsConfig);

export const AuthActions = {
	register: (dto: RegisterRequestDto) =>
		authActions[EActionKeys.Register](dto)(),
	authenticate: () => authActions[EActionKeys.Authenticate]()(),

	logout: () => authActions[EActionKeys.Logout]()(),
	login: (dto: LoginRequestDto) => authActions[EActionKeys.Login](dto)(),
};
