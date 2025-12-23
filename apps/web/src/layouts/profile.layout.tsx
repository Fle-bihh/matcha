import { Activity, useMemo } from "react";
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
import {
  useLayoutSizes,
  useProfileDrawerRef,
} from "@/contexts/layout-sizes.context";
import { useWindow } from "@/hooks/window.hook";

const menuItems = [
  {
    text: "Profile",
    Icon: PersonIcon,
    path: APP_ROUTES.profile,
  },
  {
    text: "Settings",
    Icon: SettingsIcon,
    path: APP_ROUTES.profileSettings,
  },
] as const;

export function ProfileLayout() {
  const location = useLocation();
  const { push } = useRouting();
  const { headerHeight, profileDrawerWidth } = useLayoutSizes();
  const drawerRef = useProfileDrawerRef<HTMLUListElement>();
  const { isMobile } = useWindow();
  const listItemPadding = useMemo(() => (isMobile ? 1 : 4), [isMobile]);

  return (
    <Box>
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            top: `${headerHeight}px`,
          },
        }}
      >
        <List ref={drawerRef}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                disableGutters
                selected={location.pathname === item.path}
                onClick={() => push(item.path)}
                sx={{
                  paddingLeft: listItemPadding,
                  paddingRight: listItemPadding,
                  gap: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    fontSize: 32,
                    minWidth: 0,
                  }}
                >
                  {<item.Icon fontSize={"inherit"} />}
                </ListItemIcon>
                <Activity mode={isMobile ? "hidden" : "visible"}>
                  <ListItemText
                    slotProps={{
                      primary: {
                        fontSize: 22,
                      },
                    }}
                    primary={item.text}
                  />
                </Activity>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          height: `calc(100vh - ${headerHeight}px)`,
          width: `calc(100vw - ${profileDrawerWidth}px)`,
          ml: `${profileDrawerWidth}px`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
