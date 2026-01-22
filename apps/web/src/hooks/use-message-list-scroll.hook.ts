import { useRef, useEffect } from "react";
import { Message } from "@matcha/shared";
import { AuthUser } from "@matcha/shared";

interface UseMessageListScrollProps {
	messages: Message[];
	authUser: AuthUser | null;
	hasMoreMessages: boolean;
	isLoadingMessages: boolean;
	onScroll: () => void;
}

export function useMessageListScroll({
	messages,
	authUser,
	hasMoreMessages,
	isLoadingMessages,
	onScroll,
}: UseMessageListScrollProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const previousMessagesRef = useRef<typeof messages>([]);
	const previousScrollHeightRef = useRef(0);

	useEffect(() => {
		const previousMessages = previousMessagesRef.current;
		const container = messagesContainerRef.current;

		if (!container) return;

		if (messages.length > 0 && previousMessages.length > 0) {
			const lastPreviousMessage =
				previousMessages[previousMessages.length - 1];
			const lastCurrentMessage = messages[messages.length - 1];
			const firstPreviousMessage = previousMessages[0];
			const firstCurrentMessage = messages[0];

			if (
				lastPreviousMessage?.id !== lastCurrentMessage?.id &&
				lastCurrentMessage?.type === "user" &&
				"sender_id" in lastCurrentMessage &&
				lastCurrentMessage.sender_id === authUser?.id
			) {
				messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			} else if (
				firstPreviousMessage?.id !== firstCurrentMessage?.id &&
				messages.length > previousMessages.length
			) {
				const previousScrollHeight = previousScrollHeightRef.current;
				const newScrollHeight = container.scrollHeight;
				const scrollDiff = newScrollHeight - previousScrollHeight;
				container.scrollTop = scrollDiff;
			}
		} else if (previousMessages.length === 0 && messages.length > 0) {
			messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
		}

		previousMessagesRef.current = messages;
		previousScrollHeightRef.current = container.scrollHeight;
	}, [messages, authUser?.id]);

	const handleScroll = () => {
		if (!messagesContainerRef.current) return;

		const { scrollTop } = messagesContainerRef.current;

		if (scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
			onScroll();
		}
	};

	return {
		messagesContainerRef,
		messagesEndRef,
		handleScroll,
	};
}
