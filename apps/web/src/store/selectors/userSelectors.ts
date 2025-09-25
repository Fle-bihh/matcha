import { RootState } from "../store";
import { userSelectors } from "../slices/userSlice";

export const selectUsers = (state: RootState) =>
	userSelectors.selectAll(state.users);
export const selectUserByIdFromRoot = (state: RootState, userId: number) =>
	userSelectors.selectById(state.users, userId);

export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
