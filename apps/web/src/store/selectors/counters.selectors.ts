import type { TRootState } from "@/types";
import { ECounterKeys } from "@/constants/counter.constants";

export const selectCounter = (
	state: TRootState,
	key: ECounterKeys,
): number => {
	return state.counters[key];
};
