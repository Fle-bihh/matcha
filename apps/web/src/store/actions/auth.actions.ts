import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

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

export const AuthActions = createActions(authActionsConfig);
