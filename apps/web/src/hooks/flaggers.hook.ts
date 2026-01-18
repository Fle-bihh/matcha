import { useDispatch, useSelector } from "react-redux";
import { setFlagger, resetFlagger } from "@/store";
import { TRootState } from "@/types";
import { EFlaggers, FlaggerData } from "@/constants";

interface UseFlaggerReturn<T extends EFlaggers> {
	data: FlaggerData<T>;
	setFlagger: (value: FlaggerData<T>) => void;
	resetFlagger: () => void;
}

export function useFlagger<T extends EFlaggers>(
	flagger: T,
): UseFlaggerReturn<T> {
	const dispatch = useDispatch();
	const data = useSelector((state: TRootState) => state.flaggers[flagger]);

	const setFlaggerValue = (value: FlaggerData<T>) => {
		dispatch(setFlagger({ key: flagger, value }));
	};

	const resetFlaggerValue = () => {
		dispatch(resetFlagger(flagger));
	};

	return {
		data,
		setFlagger: setFlaggerValue,
		resetFlagger: resetFlaggerValue,
	};
}
