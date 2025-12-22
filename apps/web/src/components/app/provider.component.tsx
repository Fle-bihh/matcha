import { Container } from "@/container/index.container";
import React, { useMemo, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";
import { NavigationSetup } from "./navigation.component";
import { Snackbar } from "../utils";

import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/config";

export function Provider({ children }: React.PropsWithChildren<{}>) {
  const container = useMemo(() => new Container(), []);
  const store = useMemo(() => container.store, [container]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme}>
        <ReduxProvider store={store}>
          <NavigationSetup container={container} />
          <AuthProvider>{children}</AuthProvider>
          <Snackbar />
        </ReduxProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
