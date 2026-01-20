import type { TRootState } from "@/types";

export const selectVisitsReceivedCount = (state: TRootState): number => {
	return state.visits.receivedCount;
};
