import { EntryPage } from "@/pages";
import { APP_NAME } from "@matcha/shared";
import { Outlet, Route, Routes } from "react-router-dom";

export function EntryLayout() {
  return (
    <div>
      <h1>Entry Area - {APP_NAME}</h1>
      <Outlet />
    </div>
  );
}
