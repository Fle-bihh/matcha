import { APP_NAME } from "@matcha/shared";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useAuthUser } from "@/hooks/auth.hook";
import { APP_ROUTES } from "@/constants";
import { useHeaderRef } from "@/contexts/layout-sizes.context";
import { useRouting } from "@/hooks/routing.hooks";

export function HomeHeader() {
  const routing = useRouting();
  const { authUser, logout } = useAuthUser();
  const appBarRef = useHeaderRef<HTMLDivElement>();

  const handleLogoClick = () => {
    routing.push(APP_ROUTES.protected);
  };

  const handleAccountClick = () => {
    routing.push(APP_ROUTES.profile);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" ref={appBarRef}>
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
          <Typography variant="body1">{authUser?.username}</Typography>
          <IconButton
            color="inherit"
            onClick={handleAccountClick}
            aria-label="account"
          >
            <AccountIcon />
          </IconButton>
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
