import { RootState } from "../index";
import { selectAllUsers, selectUserById } from "../slices/userSlice";

export const selectUsers = (state: RootState) => selectAllUsers(state.users);
export const selectUserByIdFromRoot = (state: RootState, userId: number) =>
	selectUserById(state.users, userId);

export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
