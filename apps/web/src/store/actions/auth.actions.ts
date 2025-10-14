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

const registerAction = (dto: RegisterRequestDto) =>
	authActions[EActionKeys.Register](dto)();
const authenticateAction = () => authActions[EActionKeys.Authenticate]()();
const logoutAction = () => authActions[EActionKeys.Logout]()();
const loginAction = (dto: LoginRequestDto) =>
	authActions[EActionKeys.Login](dto)();

export const AuthActions = {
	register: registerAction,
	authenticate: authenticateAction,

	logout: logoutAction,
	login: loginAction,
};
