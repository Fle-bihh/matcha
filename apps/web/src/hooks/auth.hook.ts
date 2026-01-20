import { useSelector } from "react-redux";
import {
	AuthActions,
	UserActions,
	LocationActions,
	selectUnreadConversationsCount,
} from "@/store";
import { selectAuthUser, selectIsAuthInitialized } from "@/store";
import { useDispatchActions } from "./actions.hooks";

export const useAuthUser = () => {
	const authUser = useSelector(selectAuthUser);
	const isInitialized = useSelector(selectIsAuthInitialized);
	const unreadConversationsCount = useSelector(
		selectUnreadConversationsCount,
	);

	const actions = useDispatchActions({
		...AuthActions,
		...UserActions,
		...LocationActions,
	});

	return {
		authUser,
		isInitialized,
		unreadConversationsCount,
		...actions,
	};
};
