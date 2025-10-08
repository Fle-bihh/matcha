import { useMemo } from "react";
import { EThunkFlaggerKeys, IThunkFlagger } from "@/types";
import { useFlagger } from "./flaggers.hook";

export interface IUseThunksReturn {
	isLoading: boolean;
	error: string | null;
	hasError: boolean;
}

export const useThunks = (thunkKeys: EThunkFlaggerKeys[]): IUseThunksReturn => {
	const thunkData = thunkKeys.map((key) => useFlagger({ flagger: key }).data);

	return useMemo(() => {
		const isLoading = thunkData.some((data) => data?.isLoading || false);

		const firstError = thunkData.find((data) => data?.error)?.error;
		const error = firstError?.message || null;
		const hasError = Boolean(firstError);

		return {
			isLoading,
			error,
			hasError,
		};
	}, [thunkData]);
};
