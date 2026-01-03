import { useDispatchActions } from "./actions.hooks";
import { BrowsingActions } from "@/store";

export const useBrowsing = () => {
	const actions = useDispatchActions({
		...BrowsingActions,
	});

	return actions;
};
