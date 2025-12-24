import { useCrossTabSync } from "@/hooks/cross-tab.hook";

export function CrossTabSyncProvider({
  children,
}: React.PropsWithChildren<{}>) {
  useCrossTabSync();
  return <>{children}</>;
}
