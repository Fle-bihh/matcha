import { Container } from "@/container/index.container";
import React, { useMemo, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { AuthProvider } from "../auth";
import { NavigationSetup } from "./navigation.component";

export function Provider({ children }: React.PropsWithChildren<{}>) {
  const container = useMemo(() => new Container(), []);
  const store = useMemo(() => container.store, [container]);

  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <NavigationSetup container={container} />
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </BrowserRouter>
  );
}
