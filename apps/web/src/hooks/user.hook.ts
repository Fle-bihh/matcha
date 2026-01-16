import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";
import { useDispatchActions } from "./actions.hooks";
import { UserActions } from "@/store";
import { useAuthUser } from "./auth.hook";

export const useUser = (userId: string | undefined) => {
	const user = useSelector(
		selectEntityById<StoreUser>(EEntityTypes.Users, userId ?? "")
	);

	const { getUserById } = useAuthUser();

	useEffect(() => {
		if (userId && !user) {
			console.log("Fetching user with ID:", userId);
			getUserById(userId);
		}
	}, [userId, user, getUserById]);

	return user;
};
