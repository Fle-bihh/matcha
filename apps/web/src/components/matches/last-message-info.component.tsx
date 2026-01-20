import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectLastMessageByMatchId } from "@/store/selectors/message.selectors";
import { getMessagePreview } from "@/utils";
import { formatDistanceToNow } from "date-fns";

interface LastMessageInfoProps {
	matchId: number;
}

export function LastMessageInfo({ matchId }: LastMessageInfoProps) {
	const lastMessage = useSelector(selectLastMessageByMatchId(matchId));

	if (!lastMessage) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					minWidth: 80,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					No messages
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-end",
				minWidth: 120,
			}}
		>
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{
					maxWidth: 150,
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				}}
			>
				{getMessagePreview(lastMessage, 30)}
			</Typography>
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ mt: 0.5 }}
			>
				{formatDistanceToNow(new Date(lastMessage.created_at), {
					addSuffix: true,
				})}
			</Typography>
		</Box>
	);
}
