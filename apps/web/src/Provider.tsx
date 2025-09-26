import React, { useMemo } from "react";
import { Container } from "./container/Container.ts";
import { Provider as ReduxProvider } from "react-redux";

function Provider({ children }: React.PropsWithChildren<{}>) {
	const container = new Container();
	const store = useMemo(() => container.store, [container]);

	return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

export default Provider;
