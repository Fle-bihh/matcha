import { selectEntityById } from "./entity.selectors";
import { EEntityTypes, TRootState } from "@/types";
import { createSelector } from "@reduxjs/toolkit";
import { selectPaginatedEntities } from "./pagination.selectors";
import { EPagerKeys } from "@/constants";

export const selectUserById = (state: TRootState, userId?: string) => {
	if (!userId) return undefined;
	const user = selectEntityById(EEntityTypes.Users, userId.toString())(state);
	return user?.is_blocked ? undefined : user;
};

export const selectBrowsingUsers = createSelector(
	[selectPaginatedEntities(EPagerKeys.Users, EEntityTypes.Users)],
	(users) => users.filter((user) => !user.is_blocked),
);
