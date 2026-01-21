import { createSelector } from "@reduxjs/toolkit";
import { EEntityTypes, TRootState } from "@/types";
import { selectEntitiesByType } from "./entity.selectors";

export const selectNotifications = createSelector(
	[selectEntitiesByType(EEntityTypes.Notifications)],
	(notifications) =>
		Object.values(notifications).sort(
			(a, b) =>
				new Date(b.created_at).getTime() -
				new Date(a.created_at).getTime(),
		),
);
