import { Container } from "@/container/container";
import React, { useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

export function Provider({ children }: React.PropsWithChildren<{}>) {
	const container = useMemo(() => new Container(), []);
	const store = useMemo(() => container.store, [container]);

	return (
		<BrowserRouter>
			<ReduxProvider store={store}>{children}</ReduxProvider>
		</BrowserRouter>
	);
}
