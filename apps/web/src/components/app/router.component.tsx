import { ROUTES } from "@/constants";
import { Route, Routes } from "react-router-dom";
import { withLoggedIn, withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage, HomePage } from "@/pages";
import { EntryLayout, ProtectedLayout } from "@/layouts";
import { RegisterPage, LoginPage, ForgotPasswordPage } from "@/pages/auth";
import { ConfirmEmailPage } from "@/pages/auth/confirm-email.page";

export function Router() {
  return (
    <Routes>
      <Route path={ROUTES.entry} element={withLoggedOut(EntryLayout)()}>
        <Route index element={<EntryPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.confirmEmail} element={<ConfirmEmailPage />} />
      </Route>
      <Route path={ROUTES.protected} element={withLoggedIn(ProtectedLayout)()}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path={ROUTES.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
