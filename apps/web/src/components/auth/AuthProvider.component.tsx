import { useAuthUser } from "@/hooks/auth.hook";
import { useThunks } from "@/hooks/thunks.hook";
import { EThunkFlaggerKeys } from "@/types";
import { PropsWithChildren, useEffect, useState } from "react";

export function AuthProvider({ children }: PropsWithChildren<{}>) {
	const { authUser, authenticate } = useAuthUser();
	const { isLoading } = useThunks([EThunkFlaggerKeys.Authenticate]);
	const [startedAuth, setStartedAuth] = useState(false);

	useEffect(() => {
		if (!startedAuth && !authUser && !isLoading) {
			setStartedAuth(true);
			authenticate();
		}
	}, [startedAuth, authUser, isLoading, authenticate]);

	if (!startedAuth || isLoading) {
		return <div>Loading...</div>;
	}
	return <>{children}</>;
}
