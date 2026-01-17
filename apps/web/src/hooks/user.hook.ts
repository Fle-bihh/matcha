import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";
import { useAuthUser } from "./auth.hook";
import { useVisits } from "./visit.hook";

export const useUser = (
	userId: string | undefined,
	shouldTrackVisit = false
) => {
	const user = useSelector(
		selectEntityById<StoreUser>(EEntityTypes.Users, userId ?? "")
	);

	const { getUserById } = useAuthUser();
	const { createVisit } = useVisits();
	const visitTrackedRef = useRef(false);

	useEffect(() => {
		if (userId && !user) {
			getUserById(userId);
		}
	}, [userId, user, getUserById]);

	useEffect(() => {
		if (shouldTrackVisit && userId && user && !visitTrackedRef.current) {
			console.log("Tracking visit for user:", userId);
			visitTrackedRef.current = true;
			createVisit({ visited_id: parseInt(userId, 10) });
		}
	}, [shouldTrackVisit, userId, user, createVisit]);

	return user;
};
