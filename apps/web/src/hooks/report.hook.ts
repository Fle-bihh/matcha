import { ReportActions } from "@/store";
import { useDispatchActions } from "./actions.hooks";

export const useReport = () => {
	const actions = useDispatchActions({
		...ReportActions,
	});

	return actions;
};
