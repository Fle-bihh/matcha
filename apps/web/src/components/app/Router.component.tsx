import { ROUTES } from "@/constants";
import { Route, Routes, Outlet } from "react-router-dom";
import { withLoggedIn, withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage } from "@/pages";
import { HomePage } from "@/pages/Home.page";

function ProtectedLayout() {
	return (
		<div>
			<h1>Protected Area</h1>
			<Outlet />
		</div>
	);
}

export function Router() {
	return (
		<Routes>
			<Route path={ROUTES.entry} element={withLoggedOut(EntryPage)()} />
			<Route
				path={ROUTES.protected}
				element={withLoggedIn(ProtectedLayout)()}
			>
				<Route index element={<HomePage />} />
			</Route>
			<Route path={ROUTES.notFound} element={<NotFoundPage />} />
		</Routes>
	);
}
