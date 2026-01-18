import { useActionsData } from "@/hooks";
import { useAuthUser } from "@/hooks";
import { EActionKeys } from "@/types";
import { PropsWithChildren, useEffect, useRef } from "react";
import { AuthenticateLoading } from "../loading/authenticate-loading.component";

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const { authenticate, isInitialized } = useAuthUser();
  const { isLoading } = useActionsData([EActionKeys.Authenticate]);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    if (!hasAttemptedAuth.current && !isInitialized) {
      hasAttemptedAuth.current = true;
      authenticate();
    }
  }, [authenticate, isInitialized]);

  if (!isInitialized || isLoading) {
    return <AuthenticateLoading />;
  }

  return <>{children}</>;
}
