import { HomeHeader } from "@/components/home/header.component";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import {
  LayoutSizesProvider,
  useLayoutSizes,
} from "@/contexts/layout-sizes.context";

function ProtectedLayoutContent() {
  const { headerHeight } = useLayoutSizes();
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
    <LayoutSizesProvider>
      <ProtectedLayoutContent />
    </LayoutSizesProvider>
  );
}
