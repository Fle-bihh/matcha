import {
	Box,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Typography,
} from "@mui/material";

interface MatchItemProps {
	name: string;
	lastMessage: string;
	lastMessageTime: string;
	avatarUrl?: string;
	unread?: boolean;
}

export function MatchItem({
	name,
	lastMessage,
	lastMessageTime,
	avatarUrl,
	unread = false,
}: MatchItemProps) {
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
					src={avatarUrl}
					sx={{
						width: 56,
						height: 56,
						mr: 2,
					}}
				>
					{name.charAt(0).toUpperCase()}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={
					<Typography
						variant="subtitle1"
						fontWeight={unread ? 600 : 400}
					>
						{name}
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
						{lastMessage}
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
					{lastMessageTime}
				</Typography>
				{unread && (
					<Box
						sx={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							bgcolor: "primary.main",
							mt: 0.5,
						}}
					/>
				)}
			</Box>
		</ListItem>
	);
}
