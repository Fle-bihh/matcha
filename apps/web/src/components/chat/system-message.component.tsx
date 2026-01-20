import { Box, Typography } from "@mui/material";
import { SystemMessage } from "@matcha/shared";
import { getSystemMessageContent } from "@/utils";

interface SystemMessageProps {
	message: SystemMessage;
}

export function SystemMessageComponent({ message }: SystemMessageProps) {
	return (
		<Box
			sx={{
				mb: 2,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Typography variant="caption" color="text.secondary">
				{getSystemMessageContent(message)}
			</Typography>
		</Box>
	);
}
