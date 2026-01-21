import { NotificationActions, selectEntitiesByType } from "@/store";
import { EEntityTypes } from "@/types";
import { useSelector } from "react-redux";
import { useDispatchActions } from "./actions.hooks";
import { usePager } from "./pagination.hook";
import { EPagerKeys } from "@/constants";

export const useNotification = (loadData: boolean = false) => {
	const { getNotifications } = useDispatchActions(NotificationActions);

	const notifications = useSelector(
		selectEntitiesByType(EEntityTypes.Notifications),
	);

	const { hasNextPage, refresh } = usePager(EEntityTypes.Notifications, {
		pagerKey: EPagerKeys.Notifications,
		fn: getNotifications,
		loadData: false,
	});

	return {
		notifications,
		hasNextPage,
		refreshNotifications: refresh,
	};
};
