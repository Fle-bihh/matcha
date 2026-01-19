import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectEntityById } from "@/store";
import { EEntityTypes, StoreUser } from "@/types";
import { useAuthUser } from "./auth.hook";
import { useVisits } from "./visit.hook";
import { useScroll } from "./scroll.hooks";
import { useWebSocketSubscription } from "./websocket-subscription.hook";

interface UserHookProps {
	userId: string | undefined;
	shouldTrackVisit?: boolean;
	shouldFetch?: boolean;
}
export const useUser = (props: UserHookProps) => {
	const { userId, shouldTrackVisit = false, shouldFetch = false } = props;
	const user = useSelector(
		selectEntityById(EEntityTypes.Users, userId ?? ""),
	);

	const { scrollToTop } = useScroll();

	const { getUserById } = useAuthUser();
	const { createVisit } = useVisits();
	const { subscribeToUserStatus, unsubscribeFromUserStatus } =
		useWebSocketSubscription();

	const visitTrackedRef = useRef(false);
	const fetchedRef = useRef(false);

	useEffect(() => {
		if (shouldFetch && userId && !fetchedRef.current) {
			fetchedRef.current = true;
			getUserById(userId);
		}
	}, [shouldFetch, userId, getUserById]);

	useEffect(() => {
		if (!shouldTrackVisit || !userId) return;

		const userIdNum = parseInt(userId, 10);

		subscribeToUserStatus(userIdNum);

		return () => {
			unsubscribeFromUserStatus(userIdNum);
		};
	}, [
		shouldTrackVisit,
		userId,
		subscribeToUserStatus,
		unsubscribeFromUserStatus,
	]);

	useEffect(() => {
		if (!shouldTrackVisit || !userId || !user) return;

		if (!visitTrackedRef.current) {
			visitTrackedRef.current = true;
			createVisit({ visited_id: parseInt(userId, 10) });
			scrollToTop();
		}
	}, [shouldTrackVisit, userId, user, createVisit, scrollToTop]);

	return user;
};
