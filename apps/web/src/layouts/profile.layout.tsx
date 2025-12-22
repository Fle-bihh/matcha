import { useMemo, useCallback } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { APP_ROUTES } from "@/constants";
import { useRouting } from "@/hooks/routing.hooks";
import { useHeaderHeight } from "@/contexts/header-height.context";
import { useWindow } from "@/hooks/window.hook";

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: "Profile", icon: <PersonIcon />, path: APP_ROUTES.profile },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: APP_ROUTES.profileSettings,
  },
] as const;

export function ProfileLayout() {
  const location = useLocation();
  const { push } = useRouting();
  const { headerHeight } = useHeaderHeight();
  const { isMobile } = useWindow();

  const drawerWidth = useMemo(() => (isMobile ? 56 : DRAWER_WIDTH), [isMobile]);

  const navigate = useCallback(
    (path: string) => {
      push(path);
    },
    [push]
  );

  return (
    <Box>
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            top: `${headerHeight}px`,
            width: drawerWidth,
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
                <ListItemIcon sx={{ width: 36 }}>{item.icon}</ListItemIcon>
                {!isMobile && (
                  <ListItemText sx={{ lineHeight: 36 }} primary={item.text} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          height: `calc(100vh - ${headerHeight}px)`,
          width: `calc(100vw - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
