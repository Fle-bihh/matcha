import { IContainer, ETokens } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAction } from "../slices";
import { serializeError } from "@/utils/error.utils";
import { EActionKeys, EActionStatus } from "@/types/actions.types";

const baseAction = <T extends EActionKeys>(
	actionType: T,
	actionFunction: (container: IContainer) => Promise<void>
) => {
	return createAsyncThunk(
		actionType,
		async (_, { rejectWithValue, extra }) => {
			const { container } = extra as { container: IContainer };
			try {
				container.store.dispatch(
					setAction({
						key: actionType,
						value: {
							status: EActionStatus.Loading,
							error: undefined,
						},
					})
				);
				await actionFunction(container);
				container.store.dispatch(
					setAction({
						key: actionType,
						value: { status: EActionStatus.Success },
					})
				);
				return;
			} catch (error) {
				const serializedError = serializeError(error);

				container.store.dispatch(
					setAction({
						key: actionType,
						value: {
							status: EActionStatus.Error,
							error: serializedError,
						},
					})
				);
				return rejectWithValue(serializedError);
			}
		}
	);
};

type ServiceMethodRef = {
	serviceToken: ETokens;
	methodName: string;
};

type ActionConfig<K extends EActionKeys = EActionKeys> = {
	[P in K]: ServiceMethodRef;
};

export const createActions = <T extends Partial<ActionConfig>>(config: T) => {
	const actions: Record<keyof T, any> = {} as Record<keyof T, any>;

	for (const [actionKey, { serviceToken, methodName }] of Object.entries(
		config
	)) {
		actions[actionKey as keyof T] = (dto?: any) =>
			baseAction(actionKey as EActionKeys, async (container) => {
				const service = container.get(serviceToken);
				await (service as any)[methodName](dto);
			});
	}

	return actions;
};
