import { Box, Typography } from "@mui/material";
import {
	SystemMessage,
	SystemMessageType,
	MatchStartedSystemMessageData,
} from "@matcha/shared";

interface SystemMessageProps {
	message: SystemMessage;
}

function MatchStartedMessage({
	data,
}: {
	data: MatchStartedSystemMessageData;
}) {
	return (
		<Typography variant="caption" color="text.secondary">
			{data.first_name_1} and {data.first_name_2} matched on{" "}
			{new Date(data.started_at).toLocaleString()}
		</Typography>
	);
}

const systemMessageComponents = {
	[SystemMessageType.MatchStarted]: MatchStartedMessage,
};

export function SystemMessageComponent({ message }: SystemMessageProps) {
	const MessageContent =
		systemMessageComponents[message.system_type] ||
		(() => (
			<Typography variant="caption" color="text.secondary">
				System message
			</Typography>
		));

	return (
		<Box
			sx={{
				mb: 2,
				display: "flex",
				justifyContent: "center",
			}}
		>
			<MessageContent data={message.data} />
		</Box>
	);
}
