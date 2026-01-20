import { useRef, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { MessageItem } from "./message-item.component";
import {
	selectMessagesByMatchId,
	selectHasMoreMessages,
} from "@/store/selectors/message.selectors";
import { useActionsData } from "@/hooks";
import { EActionKeys, TRootState } from "@/types";

interface MessageListProps {
	onScroll: () => void;
	matchId?: string;
}

export function MessageList({ onScroll, matchId }: MessageListProps) {
	const messages = useSelector(selectMessagesByMatchId(matchId));
	const hasMoreMessages = useSelector(selectHasMoreMessages);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const { isLoading: isLoadingMessages } = useActionsData([
		EActionKeys.GetMessages,
	]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages?.length]);

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
