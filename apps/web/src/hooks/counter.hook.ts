import { useSelector } from "react-redux";
import { ECounterKeys } from "@/constants";
import { selectCounter } from "@/store";
import { TRootState } from "@/types";

export function useCounter(key: ECounterKeys): number {
	return useSelector((state: TRootState) => selectCounter(state, key));
}
