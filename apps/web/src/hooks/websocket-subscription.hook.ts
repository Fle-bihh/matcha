import { useContext } from "react";
import { WebSocketSubscriptionContext } from "@/contexts/websocket-subscription.context";

export const useWebSocketSubscription = () => {
	const context = useContext(WebSocketSubscriptionContext);

	if (!context) {
		throw new Error(
			"useWebSocketSubscription must be used within WebSocketSubscriptionProvider"
		);
	}

	return context;
};
