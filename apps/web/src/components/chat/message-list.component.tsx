import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { MessageItem } from "./message-item.component";
import {
	selectMessagesByMatchId,
	selectHasMoreMessages,
} from "@/store/selectors/message.selectors";
import { selectAuthUser } from "@/store/selectors/auth.selectors";
import { useActionsData, useAuthUser, useMessageListScroll } from "@/hooks";
import { EActionKeys, TRootState } from "@/types";

interface MessageListProps {
	onScroll: () => void;
	matchId?: string;
}

export function MessageList({ onScroll, matchId }: MessageListProps) {
	const messages = useSelector(selectMessagesByMatchId(matchId));
	const hasMoreMessages = useSelector(selectHasMoreMessages(matchId));
	const { authUser } = useAuthUser();
	const { isLoading: isLoadingMessages } = useActionsData([
		EActionKeys.GetMessages,
	]);

	const { messagesContainerRef, messagesEndRef, handleScroll } =
		useMessageListScroll({
			messages,
			authUser,
			hasMoreMessages,
			isLoadingMessages,
			onScroll,
		});

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
