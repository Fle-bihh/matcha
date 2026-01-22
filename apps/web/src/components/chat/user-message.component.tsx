import { Box, Paper, Typography } from "@mui/material";
import { UserMessage } from "@matcha/shared";
import { useAuthUser } from "@/hooks";
import { useMemo } from "react";

interface UserMessageProps {
	message: UserMessage;
}

export const UserMessageComponent = function UserMessageComponent({
	message,
}: UserMessageProps) {
	const { authUser } = useAuthUser();

	const isOwnMessage = message.sender_id === authUser?.id;

	const formattedDate = useMemo(
		() => new Date(message.created_at).toLocaleString(),
		[message.created_at],
	);

	return (
		<Box
			sx={{
				mb: 2,
				display: "flex",
				justifyContent: isOwnMessage ? "flex-end" : "flex-start",
			}}
		>
			<Paper
				sx={{
					p: 2,
					maxWidth: "70%",
					bgcolor: isOwnMessage ? "primary.main" : "background.paper",
					color: isOwnMessage
						? "primary.contrastText"
						: "text.primary",
				}}
			>
				<Typography variant="body1">{message.content}</Typography>
				<Typography
					variant="caption"
					sx={{
						mt: 0.5,
						display: "block",
						opacity: 0.8,
					}}
				>
					{formattedDate}
				</Typography>
			</Paper>
		</Box>
	);
};
