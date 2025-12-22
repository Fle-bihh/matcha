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
import { useHeaderHeight } from "@/contexts/header-height.context";

const menuItems = [
  { text: "Profile", icon: <PersonIcon />, path: APP_ROUTES.profile },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: APP_ROUTES.profileSettings,
  },
];

const DRAWER_WIDTH = 240;

export function ProfileLayout() {
  const location = useLocation();
  const routing = useRouting();
  const { headerHeight } = useHeaderHeight();
  const navigate = (path: string) => {
    routing.push(path);
  };

  const contentHeight = `calc(100vh - ${headerHeight}px)`;
  const contentWidth = `calc(100vw - ${DRAWER_WIDTH}px)`;

  return (
    <Box>
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            top: `${headerHeight}px`,
            width: DRAWER_WIDTH,
          },
        }}
      >
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
      </Drawer>
      <Box
        component="main"
        sx={{
          height: contentHeight,
          width: contentWidth,
          ml: `${DRAWER_WIDTH}px`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
