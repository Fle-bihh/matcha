import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { useDispatchActions } from "@/hooks/actions.hooks";
import { WebSocketSubscriptionActions } from "@/store";
import { EWebSocketChannels } from "@matcha/shared";

type WebSocketSubscriptionContextType = ReturnType<
	typeof useWebSocketSubscriptionState
>;

export const WebSocketSubscriptionContext = createContext<
	WebSocketSubscriptionContextType | undefined
>(undefined);

function useWebSocketSubscriptionState() {
	const { subscribeToChannel, unsubscribeFromChannel } = useDispatchActions({
		...WebSocketSubscriptionActions,
	});

	const activeSubscriptions = useRef<Set<string>>(new Set());

	const subscribeToUserStatus = useCallback(
		(userId: number) => {
			const channel = EWebSocketChannels.UserStatus(userId);

			if (activeSubscriptions.current.has(channel)) {
				return;
			}

			subscribeToChannel({ channel });
			activeSubscriptions.current.add(channel);
		},
		[subscribeToChannel]
	);

	const unsubscribeFromUserStatus = useCallback(
		(userId: number) => {
			const channel = EWebSocketChannels.UserStatus(userId);

			if (!activeSubscriptions.current.has(channel)) {
				return;
			}

			unsubscribeFromChannel({ channel });
			activeSubscriptions.current.delete(channel);
		},
		[unsubscribeFromChannel]
	);

	useEffect(() => {
		return () => {
			activeSubscriptions.current.forEach((channel) => {
				unsubscribeFromChannel({ channel });
			});
			activeSubscriptions.current.clear();
		};
	}, [unsubscribeFromChannel]);

	return {
		subscribeToUserStatus,
		unsubscribeFromUserStatus,
	};
}

export function WebSocketSubscriptionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const value = useWebSocketSubscriptionState();

	return (
		<WebSocketSubscriptionContext.Provider value={value}>
			{children}
		</WebSocketSubscriptionContext.Provider>
	);
}
