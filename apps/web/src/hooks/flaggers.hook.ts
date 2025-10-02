import { useDispatch, useSelector } from "react-redux";
import { setFlagger as setSliceFlagger } from "@/store/slices/flaggers.slice";
import {
	EAllFlaggerKeys,
	EFlaggerKeys,
	IFlaggerDataTypes,
	TFlaggerData,
} from "@/types";

interface IProps<T extends EAllFlaggerKeys> {
	flagger: T;
}

export const useFlagger = <T extends EAllFlaggerKeys>({
	flagger,
}: IProps<T>) => {
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
