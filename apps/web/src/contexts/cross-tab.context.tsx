import { useCrossTabSync } from "@/hooks";

export function CrossTabSyncProvider({
	children,
}: React.PropsWithChildren<{}>) {
	useCrossTabSync();
	return <>{children}</>;
}
