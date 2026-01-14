import { createContext, useContext, ReactNode } from "react";
import { Container } from "@/container/index.container";

const ContainerContext = createContext<Container | undefined>(undefined);

export function ContainerProvider({
	children,
	container,
}: {
	children: ReactNode;
	container: Container;
}) {
	return (
		<ContainerContext.Provider value={container}>
			{children}
		</ContainerContext.Provider>
	);
}

export function useContainer(): Container {
	const context = useContext(ContainerContext);
	if (!context) {
		throw new Error("useContainer must be used within ContainerProvider");
	}
	return context;
}
