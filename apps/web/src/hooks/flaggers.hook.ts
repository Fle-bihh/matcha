import { useDispatch, useSelector } from "react-redux";
import { setFlagger as setSliceFlagger } from "@/store/slices/flaggers.slice";
import { EFlaggerKeys, IFlaggerDataTypes, TFlaggerData } from "@/types";

interface IProps<T extends EFlaggerKeys> {
	flagger: T;
}

export const useFlagger = <T extends EFlaggerKeys>({ flagger }: IProps<T>) => {
	const dispatch = useDispatch();
	const flaggerData: TFlaggerData<T> | undefined = useSelector(
		(state: any) => state?.flaggers?.[flagger]
	);

	const setFlagger = (data: IFlaggerDataTypes[T]) => {
		dispatch(setSliceFlagger({ key: flagger, value: data }));
	};

	return {
		setFlagger,
		data: flaggerData,
	};
};
