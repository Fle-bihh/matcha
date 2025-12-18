import { HomeHeader } from "@/components/home/header.component";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export function ProtectedLayout() {
  return (
    <div>
      <HomeHeader />
      <Outlet />
    </div>
  );
}
