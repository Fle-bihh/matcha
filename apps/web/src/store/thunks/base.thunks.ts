import { EFlaggerKeys, IContainer } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearFlagger, setFlagger } from "../slices";
import { serializeError } from "@/utils/error.utils";

export const baseThunk = <T extends EFlaggerKeys>(
	thunkType: T,
	thunkFunction: (container: IContainer) => Promise<void>
) => {
	return createAsyncThunk(
		thunkType,
		async (_, { rejectWithValue, extra }) => {
			const { container } = extra as { container: IContainer };
			try {
				container.store.dispatch(clearFlagger({ key: thunkType }));
				await thunkFunction(container);
				container.store.dispatch(
					setFlagger({
						key: thunkType,
						value: { isLoading: false, success: true },
					})
				);
				return;
			} catch (error) {
				const serializedError = serializeError(error);

				container.store.dispatch(
					setFlagger({
						key: thunkType,
						value: {
							isLoading: false,
							success: false,
							error: serializedError,
						},
					})
				);
				return rejectWithValue(serializedError);
			}
		}
	);
};
