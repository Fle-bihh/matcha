import { IContainer } from "@/types/container.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface IBaseThunkParams {
	container: IContainer;
}

export const baseThunk = <T extends string>(
	thunkType: T,
	thunkFunction: (container: IContainer) => Promise<unknown>
) => {
	return createAsyncThunk(
		thunkType,
		async (_, { rejectWithValue, extra }) => {
			try {
				const { container } = extra as { container: IContainer };
				return await thunkFunction(container);
			} catch (error) {
				return rejectWithValue(error);
			}
		}
	);
};
