import { Container } from "@/container/container";
import React, { useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";

function Provider({ children }: React.PropsWithChildren<{}>) {
	const container = useMemo(() => new Container(), []);
	const store = useMemo(() => container.store, [container]);

	return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

export default Provider;
