import {
	Box,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Typography,
} from "@mui/material";
import { Match } from "@matcha/shared";

interface MatchItemProps {
	match: Match;
}

export function MatchItem({ match }: MatchItemProps) {
	return (
		<ListItem
			sx={{
				borderBottom: "1px solid",
				borderColor: "divider",
				py: 2,
				cursor: "pointer",
				"&:hover": {
					bgcolor: "action.hover",
				},
			}}
		>
			<ListItemAvatar>
				<Avatar
					sx={{
						width: 56,
						height: 56,
						mr: 2,
					}}
				>
					{match.user1_id}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={
					<Typography variant="subtitle1">
						Match #{match.id}
					</Typography>
				}
				secondary={
					<Typography
						variant="body2"
						color="text.secondary"
						noWrap
						sx={{
							maxWidth: "calc(100% - 80px)",
						}}
					>
						Users: {match.user1_id} & {match.user2_id}
					</Typography>
				}
				sx={{ pr: 2 }}
			/>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					minWidth: 80,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					Placeholder
				</Typography>
			</Box>
		</ListItem>
	);
}
