import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";

export const useUser = (userId: string | undefined) => {
	const user = useSelector(
		selectEntityById<StoreUser>(EEntityTypes.Users, userId ?? "")
	);

	useEffect(() => {
		if (userId && !user) {
			console.log(`User ${userId} not found in store, would dispatch fetchUser action`);
		}
	}, [userId, user]);

	return user;
};
