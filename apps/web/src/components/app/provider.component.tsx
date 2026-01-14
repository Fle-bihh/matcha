import { Container } from "@/container/index.container";
import React, { useMemo, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";
import { NavigationSetup } from "./navigation.component";
import { Snackbar } from "../utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCrossTabSync } from "@/hooks/cross-tab.hook";
import { ContainerProvider } from "@/contexts/container.context";

import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/config";
import { CrossTabSyncProvider } from "@/contexts/cross-tab.context";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

export function Provider({ children }: React.PropsWithChildren<{}>) {
	const container = useMemo(() => new Container(), []);
	const store = useMemo(() => container.store, [container]);

	return (
		<BrowserRouter>
			<ThemeProvider theme={appTheme}>
				<ReduxProvider store={store}>
					<QueryClientProvider client={queryClient}>
						<ContainerProvider container={container}>
							<NavigationSetup container={container} />
							<CrossTabSyncProvider>
								<AuthProvider>{children}</AuthProvider>
							</CrossTabSyncProvider>
							<Snackbar />
						</ContainerProvider>
					</QueryClientProvider>
				</ReduxProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
