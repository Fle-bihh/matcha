import { ROUTES } from "@/constants";
import { Route, Routes } from "react-router-dom";
import { withLoggedOut } from "../utils";
import { EntryPage, NotFoundPage } from "@/pages";

export function Router() {
	return (
		<Routes>
			<Route path={ROUTES.entry} element={withLoggedOut(EntryPage)()} />
			<Route path={ROUTES.notFound} element={<NotFoundPage />} />
		</Routes>
	);
}
