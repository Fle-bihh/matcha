import { Box, Paper, Typography } from "@mui/material";
import { UserMessage } from "@matcha/shared";

interface UserMessageProps {
	message: UserMessage;
}

export function UserMessageComponent({ message }: UserMessageProps) {
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
				<Typography variant="body1">{message.content}</Typography>
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
