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

export const selectOtherUserInMatch = createSelector(
	[
		(state: TRootState) => state,
		(_: TRootState, match: { user1_id: number; user2_id: number }) => match,
	],
	(state, match) => {
		const authUser = state.authUser.user;
		if (!authUser) return undefined;
		const otherUserId =
			match.user1_id === authUser.id ? match.user2_id : match.user1_id;
		return selectUserById(state, otherUserId.toString());
	},
);

export const selectBrowsingUsers = createSelector(
	[selectPaginatedEntities(EPagerKeys.Users, EEntityTypes.Users)],
	(users) => users.filter((user) => !user.is_blocked),
);
