import { Container } from "@/container/index.container";
import React, { useMemo, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";
import { NavigationSetup } from "./navigation.component";
import { Snackbar } from "../utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
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
            <NavigationSetup container={container} />
            <AuthProvider>{children}</AuthProvider>
            <Snackbar />
          </QueryClientProvider>
        </ReduxProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
