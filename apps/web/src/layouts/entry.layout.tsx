import { Box, Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export function EntryLayout() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </Box>
  );
}
