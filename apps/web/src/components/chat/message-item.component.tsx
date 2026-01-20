import { Box, Paper, Typography } from "@mui/material";
import { Message, MessageType, UserMessage } from "@matcha/shared";

interface MessageItemProps {
	message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
	if (message.type === MessageType.User) {
		const userMessage = message as UserMessage;
		return (
			<Box
				sx={{
					mb: 2,
					display: "flex",
					justifyContent: "flex-start",
				}}
			>
				<Paper
					sx={{
						p: 2,
						maxWidth: "70%",
						bgcolor: "background.paper",
					}}
				>
					<Typography variant="body1">
						{userMessage.content}
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 0.5, display: "block" }}
					>
						{new Date(message.created_at).toLocaleString()}
					</Typography>
				</Paper>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				mb: 2,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Typography variant="caption" color="text.secondary">
				{message.type === MessageType.System && "System message"}
			</Typography>
		</Box>
	);
}
