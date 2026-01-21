import { APP_ROUTES } from "@/constants";
import { useRouting } from "@/hooks";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export function NotificationsHeaderIcon() {
	const routing = useRouting();

	const handleNotificationsClick = () => {
		routing.push(APP_ROUTES.notifications);
	};

	return (
		<IconButton
			color="inherit"
			onClick={handleNotificationsClick}
			aria-label="notifications"
		>
			<NotificationsIcon />
		</IconButton>
	);
}
