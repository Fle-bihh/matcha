import { useDispatch, useSelector } from "react-redux";
import { setFlag as setSliceFlag } from "@/store/slices/flags.slice";
import { EFlagKeys, IFlagDataTypes, TFlagData } from "@/types";

interface IProps<T extends EFlagKeys> {
	flagger: T;
}

export const useFlagger = <T extends EFlagKeys>({ flagger }: IProps<T>) => {
	const dispatch = useDispatch();
	const flaggerData: TFlagData<T> | undefined = useSelector(
		(state: any) => state?.flags?.[flagger]
	);

	const setFlag = (data: IFlagDataTypes[T]) => {
		dispatch(setSliceFlag({ key: flagger, value: data }));
	};

	return {
		setFlag,
		data: flaggerData,
	};
};
