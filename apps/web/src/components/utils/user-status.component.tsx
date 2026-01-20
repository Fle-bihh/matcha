import { Box, Typography, useTheme } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { UserStatus as UserStatusType } from "@matcha/shared";
import { formatDistanceToNow } from "date-fns";

interface UserStatusProps {
	status?: UserStatusType;
}

export function UserStatus({ status }: UserStatusProps) {
	const theme = useTheme();

	if (!status) {
		return null;
	}

	const isOnline = status.is_online;
	const lastActive = status.last_active_at;

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				m: 1,
			}}
		>
			<FiberManualRecordIcon
				sx={{
					fontSize: 12,
					color: isOnline
						? theme.palette.success.main
						: theme.palette.text.disabled,
				}}
			/>
			<Typography
				variant="body2"
				color={isOnline ? "success.main" : "text.secondary"}
			>
				{isOnline
					? "Online"
					: `Last seen ${formatDistanceToNow(new Date(lastActive), {
							addSuffix: true,
						})}`}
			</Typography>
		</Box>
	);
}
