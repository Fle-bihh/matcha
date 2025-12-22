import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouting } from "@/hooks/routing.hooks";

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: "Profile", icon: <PersonIcon />, path: APP_ROUTES.profile },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: APP_ROUTES.profileSettings,
  },
];

export function ProfileLayout() {
  const location = useLocation();
  const routing = useRouting();
  const navigate = (path: string) => {
    routing.push(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            // top: "auto",
          },
        }}
      >
        {/* <Toolbar /> */}
        <Box sx={{}}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
