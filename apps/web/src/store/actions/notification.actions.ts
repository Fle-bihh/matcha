import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const NotificationActions = createActions(ETokens.NotificationService, [
	EActionKeys.GetNotifications,
	EActionKeys.ReadNotifications,
] as const);
