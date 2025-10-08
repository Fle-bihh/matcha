import { Container } from "@/container/index.container";
import React, { useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";

export function Provider({ children }: React.PropsWithChildren<{}>) {
	const container = useMemo(() => new Container(), []);
	const store = useMemo(() => container.store, [container]);

	return (
		<BrowserRouter>
			<ReduxProvider store={store}>
				<AuthProvider>{children}</AuthProvider>
			</ReduxProvider>
		</BrowserRouter>
	);
}
