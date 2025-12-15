import { ROUTES } from "@/constants";
import { Route, Routes } from "react-router-dom";
import { withLoggedIn, withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage, HomePage } from "@/pages";
import { EntryLayout, ProtectedLayout } from "@/layouts";

export function Router() {
  return (
    <Routes>
      <Route path={ROUTES.entry} element={withLoggedOut(EntryLayout)()} />
      <Route
        path={ROUTES.protected}
        element={withLoggedIn(ProtectedLayout)()}
      />
      <Route path={ROUTES.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
