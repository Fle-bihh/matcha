import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";
import { useAuthUser } from "./auth.hook";
import { useVisits } from "./visit.hook";
import { useScroll } from "./scroll.hooks";

export const useUser = (
	userId: string | undefined,
	shouldTrackVisit = false
) => {
	const user = useSelector(
		selectEntityById<StoreUser>(EEntityTypes.Users, userId ?? "")
	);

	const { scrollToTop } = useScroll();

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
			visitTrackedRef.current = true;
			createVisit({ visited_id: parseInt(userId, 10) });
			scrollToTop();
		}
	}, [shouldTrackVisit, userId, user, createVisit]);

	return user;
};
