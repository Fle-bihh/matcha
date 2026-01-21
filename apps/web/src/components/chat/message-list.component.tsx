import { useRef, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { MessageItem } from "./message-item.component";
import {
	selectMessagesByMatchId,
	selectHasMoreMessages,
} from "@/store/selectors/message.selectors";
import { selectAuthUser } from "@/store/selectors/auth.selectors";
import { useActionsData, useAuthUser } from "@/hooks";
import { EActionKeys, TRootState } from "@/types";

interface MessageListProps {
	onScroll: () => void;
	matchId?: string;
}

export function MessageList({ onScroll, matchId }: MessageListProps) {
	const messages = useSelector(selectMessagesByMatchId(matchId));
	const hasMoreMessages = useSelector(selectHasMoreMessages(matchId));
	const { authUser } = useAuthUser();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const previousMessagesRef = useRef<typeof messages>([]);
	const previousScrollHeightRef = useRef(0);

	const { isLoading: isLoadingMessages } = useActionsData([
		EActionKeys.GetMessages,
	]);

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
	}, [messages]);

	const handleScroll = () => {
		if (!messagesContainerRef.current) return;

		const { scrollTop } = messagesContainerRef.current;

		if (scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
			onScroll();
		}
	};

	return (
		<Box
			ref={messagesContainerRef}
			onScroll={handleScroll}
			sx={{
				flex: 1,
				overflowY: "auto",
				mb: 2,
				p: 2,
				bgcolor: "background.default",
				borderRadius: 1,
			}}
		>
			{isLoadingMessages && messages.length === 0 ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						py: 4,
					}}
				>
					<CircularProgress />
				</Box>
			) : (
				<>
					{hasMoreMessages && (
						<Box sx={{ textAlign: "center", mb: 2 }}>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Scroll up for more messages
							</Typography>
						</Box>
					)}
					{messages.map((message) => (
						<MessageItem key={message.id} message={message} />
					))}
					<div ref={messagesEndRef} />
				</>
			)}
		</Box>
	);
}
