import { useAppDispatch } from "./hooks";
import { container } from "./store";
import { createUserSlice } from "./slices/userSlice";

// Créer une instance des actions avec le conteneur
const userSliceActions = createUserSlice(container).actions;

export const useUserActions = () => {
	const dispatch = useAppDispatch();

	return {
		fetchUsers: () => dispatch(userSliceActions.fetchUsers()),
		clearError: () => dispatch(userSliceActions.clearError()),
	};
};
