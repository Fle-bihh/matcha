import { HomeHeader } from "@/components/home/header.component";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function ProtectedLayout() {
  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <HomeHeader />
      <Outlet />
    </Box>
  );
}
