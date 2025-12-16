import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export function EntryLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
