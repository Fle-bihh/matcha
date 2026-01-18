import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store/selectors";
import { EEntityTypes, StoreUser } from "@/types";
import { useAuthUser } from "./auth.hook";
import { useVisits } from "./visit.hook";
import { useScroll } from "./scroll.hooks";
import { useWebSocketSubscription } from "./websocket-subscription.hook";

export const useUser = (
	userId: string | undefined,
	shouldTrackVisit = false,
) => {
	const user = useSelector(
		selectEntityById(EEntityTypes.Users, userId ?? ""),
	);

	const { scrollToTop } = useScroll();

	const { getUserById } = useAuthUser();
	const { createVisit } = useVisits();
	const { subscribeToUserStatus, unsubscribeFromUserStatus } =
		useWebSocketSubscription();
	const visitTrackedRef = useRef(false);

	useEffect(() => {
		if (userId && !user) {
			getUserById(userId);
		}
	}, [userId, user, getUserById]);

	useEffect(() => {
		if (!shouldTrackVisit || !userId) return;

		const userIdNum = parseInt(userId, 10);

		subscribeToUserStatus(userIdNum);

		if (user && !visitTrackedRef.current) {
			visitTrackedRef.current = true;
			createVisit({ visited_id: userIdNum });
			scrollToTop();
		}

		return () => {
			unsubscribeFromUserStatus(userIdNum);
		};
	}, [
		shouldTrackVisit,
		userId,
		user,
		subscribeToUserStatus,
		unsubscribeFromUserStatus,
		createVisit,
		scrollToTop,
	]);

	return user;
};
