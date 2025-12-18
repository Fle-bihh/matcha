import { APP_NAME } from "@matcha/shared";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/auth.hook";
import { ROUTES } from "@/constants";

export function HomeHeader() {
  const navigate = useNavigate();
  const { authUser, logout } = useAuthUser();

  const handleLogoClick = () => {
    navigate(ROUTES.protected);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static">
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
