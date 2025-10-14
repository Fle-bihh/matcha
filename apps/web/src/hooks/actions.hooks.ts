import { useDispatch, useSelector } from "react-redux";
import { setAction as setSliceAction } from "@/store/slices/actions.slice";
import { EActionKeys, EActionStatus, IActionData } from "@/types/actions.types";
import { useMemo } from "react";

interface IProps<T extends EActionKeys> {
	action: T;
}

const useAction = <T extends EActionKeys>({ action }: IProps<T>) => {
	const dispatch = useDispatch();
	const actionData: IActionData | undefined = useSelector(
		(state: any) => state?.actions?.[action]
	);

	const setAction = (data: IActionData) => {
		dispatch(setSliceAction({ key: action, value: data }));
	};

	return {
		setAction,
		data: actionData,
	};
};

export const useActions = <T extends EActionKeys>(actions: T[]) => {
	const actionData = actions.map((action) => useAction({ action }).data);
	return useMemo(() => {
		const isLoading = actionData.some(
			(data) => data?.status === EActionStatus.Loading
		);
		const firstError = actionData.find((data) => data?.error)?.error;
		const error = firstError?.message || null;
		const hasError = Boolean(firstError);

		return {
			isLoading,
			error,
			hasError,
		};
	}, [actionData, actions]);
};
