import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const MessageActions = createActions(ETokens.MessageService, [
	EActionKeys.GetMessages,
	EActionKeys.CreateMessage,
] as const);
