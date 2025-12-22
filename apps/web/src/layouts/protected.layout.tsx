import { HomeHeader } from "@/components/home/header.component";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import {
  HeaderHeightProvider,
  useHeaderHeight,
} from "@/contexts/header-height.context";

function ProtectedLayoutContent() {
  const { headerHeight } = useHeaderHeight();
  const boxHeight = useMemo(
    () => `calc(100vh - ${headerHeight}px)`,
    [headerHeight]
  );

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <HomeHeader />
      <Box
        sx={{
          height: boxHeight,
          overflow: "auto",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export function ProtectedLayout() {
  return (
    <HeaderHeightProvider>
      <ProtectedLayoutContent />
    </HeaderHeightProvider>
  );
}
