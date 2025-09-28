import { ROUTES } from "@/constants/routing.constants";
import EntryPage from "@/pages/Entry.page";
import NotFoundPage from "@/pages/NotFound.page";
import { Route, Routes } from "react-router-dom";

export function Router() {
	return (
		<Routes>
			<Route path={ROUTES.entry} element={<EntryPage />} />
			<Route path={ROUTES.notFound} element={<NotFoundPage />} />
		</Routes>
	);
}
