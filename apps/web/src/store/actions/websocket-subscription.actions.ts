import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const WebSocketSubscriptionActions = createActions(
	ETokens.WebSocketSubscriptionService,
	[
		EActionKeys.SubscribeToChannel,
		EActionKeys.UnsubscribeFromChannel,
	] as const
);
