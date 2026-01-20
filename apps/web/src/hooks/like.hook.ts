import { LikeActions } from "@/store";
import { useDispatchActions } from "./actions.hooks";

export const useLike = () => {
	const actions = useDispatchActions({
		...LikeActions,
	});

	return actions;
};
