import { NotificationActions, selectNotifications } from "@/store";
import { EActionKeys, EEntityTypes } from "@/types";
import { useSelector } from "react-redux";
import { useActionsData, useDispatchActions } from "./actions.hooks";
import { usePager } from "./pagination.hook";
import { EPagerKeys } from "@/constants";
import { useCallback, useEffect, useRef } from "react";

export const useNotification = (markAsRead: boolean = false) => {
	const { getNotifications, readNotifications } =
		useDispatchActions(NotificationActions);
	const { isLoading } = useActionsData([EActionKeys.ReadNotifications]);

	const notifications = useSelector(selectNotifications);
	const readAttemptedRef = useRef(false);

	const { hasNextPage, refresh, fetchNextPage } = usePager(
		EEntityTypes.Notifications,
		{
			pagerKey: EPagerKeys.Notifications,
			fn: getNotifications,
			loadData: false,
		},
	);

	useEffect(() => {
		if (!markAsRead) {
			readAttemptedRef.current = false;
			return;
		}
		if (notifications.length === 0) return;
		if (isLoading) return;
		if (!notifications.some((n) => !n.read_at)) return;
		if (readAttemptedRef.current) return;
		readAttemptedRef.current = true;
		readNotifications();
	}, [markAsRead, notifications, isLoading, readNotifications]);

	const refreshNotifications = useCallback(() => {
		refresh();
		readAttemptedRef.current = false;
	}, [refresh]);

	return {
		notifications,
		hasNextPage,
		refreshNotifications,
		fetchNextNotificationsPage: fetchNextPage,
	};
};
