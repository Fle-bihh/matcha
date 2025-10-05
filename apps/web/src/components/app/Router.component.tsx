import { ROUTES } from "@/constants";
import { Route, Routes } from "react-router-dom";
import { withLoggedIn, withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage } from "@/pages";
import { HomePage } from "@/pages/Home.page";

export function Router() {
	return (
		<Routes>
			<Route path={ROUTES.entry} element={withLoggedOut(EntryPage)()} />
			<Route path={ROUTES.protected} element={withLoggedIn(HomePage)()} />
			<Route path={ROUTES.notFound} element={<NotFoundPage />} />
		</Routes>
	);
}
