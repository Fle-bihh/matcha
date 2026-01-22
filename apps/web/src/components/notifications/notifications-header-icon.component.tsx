import { APP_ROUTES, ECounterKeys } from "@/constants";
import { useRouting } from "@/hooks";
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useCounter } from "@/hooks/counter.hook";

export function NotificationsHeaderIcon() {
	const routing = useRouting();
	const unreadCount = useCounter(ECounterKeys.UnreadNotifications);

	const handleNotificationsClick = () => {
		routing.push(APP_ROUTES.notifications);
	};

	return (
		<IconButton
			color="inherit"
			onClick={handleNotificationsClick}
			aria-label="notifications"
		>
			<Badge badgeContent={unreadCount} color="info">
				<NotificationsIcon />
			</Badge>
		</IconButton>
	);
}
