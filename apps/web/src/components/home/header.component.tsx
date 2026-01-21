import { APP_NAME } from "@matcha/shared";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useAuthUser } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import { useHeaderRef } from "@/contexts";
import { useRouting } from "@/hooks";
import { withEmailVerifiedComponent } from "@/utils";
import { MatchesHeaderIcon } from "../matches";
import { NotificationsHeaderIcon } from "../notifications";

const ProtectedButtons = () => {
	const routing = useRouting();
	const handleAccountClick = () => {
		routing.push(APP_ROUTES.profile);
	};

	return (
		<>
			<NotificationsHeaderIcon />
			<MatchesHeaderIcon />
			<IconButton
				color="inherit"
				onClick={handleAccountClick}
				aria-label="account"
			>
				<AccountIcon />
			</IconButton>
		</>
	);
};

const ProtectedButtonsComp = withEmailVerifiedComponent(ProtectedButtons);

export function HomeHeader() {
	const routing = useRouting();
	const { authUser, logout } = useAuthUser();
	const appBarRef = useHeaderRef<HTMLDivElement>();

	const handleLogoClick = () => {
		routing.push(APP_ROUTES.protected);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<AppBar position="fixed" ref={appBarRef}>
			<Toolbar>
				<Typography
					variant="h6"
					component="div"
					onClick={handleLogoClick}
					sx={{ cursor: "pointer", flexGrow: 1 }}
				>
					{APP_NAME}
				</Typography>
				<Box display="flex" alignItems="center" gap={1}>
					<Typography variant="body1">
						{authUser?.username}
					</Typography>

					<ProtectedButtonsComp />
					<IconButton
						color="inherit"
						onClick={handleLogout}
						aria-label="logout"
					>
						<LogoutIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
