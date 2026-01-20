import { BlockActions } from "@/store";
import { useDispatchActions } from "./actions.hooks";

export const useBlock = () => {
	const actions = useDispatchActions({
		...BlockActions,
	});

	return actions;
};
