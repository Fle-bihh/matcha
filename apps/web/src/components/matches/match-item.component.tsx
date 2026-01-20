import {
	Box,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useRouting } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import { StoreMatch, TRootState } from "@/types";
import { LastMessageInfo } from "./last-message-info.component";
import { selectOtherUserInMatch } from "@/store";

interface MatchItemProps {
	match: StoreMatch;
}

export function MatchItem({ match }: MatchItemProps) {
	const { push } = useRouting();
	const otherUser = useSelector((state: TRootState) =>
		selectOtherUserInMatch(state, match),
	);

	const handleClick = () => {
		push(APP_ROUTES.chat(match.id.toString()));
	};

	const displayName = otherUser
		? `${otherUser.first_name} ${otherUser.last_name}`
		: "Unknown User";
	const profilePicture = otherUser?.pictures_urls?.[0];

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
			onClick={handleClick}
		>
			<ListItemAvatar>
				<Avatar
					src={profilePicture}
					sx={{
						width: 56,
						height: 56,
						mr: 2,
					}}
				>
					{otherUser?.first_name?.[0] || "?"}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={
					<Typography variant="subtitle1">{displayName}</Typography>
				}
				secondary={
					otherUser?.age && (
						<Typography
							variant="body2"
							color="text.secondary"
							noWrap
							sx={{
								maxWidth: "calc(100% - 80px)",
							}}
						>
							{otherUser.age} years old
						</Typography>
					)
				}
				sx={{ pr: 2 }}
			/>
			<LastMessageInfo matchId={match.id} />
		</ListItem>
	);
}
