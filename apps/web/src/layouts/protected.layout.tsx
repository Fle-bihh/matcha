import { HomePage } from "@/pages";
import { APP_NAME } from "@matcha/shared";
import { Route, Routes } from "react-router-dom";

export function ProtectedLayout() {
	return (
		<div>
			<h1>Protected Area - {APP_NAME}</h1>
			<Routes
			>
				<Route index element={<HomePage />} />
			</Routes>
		</div>
	);
}