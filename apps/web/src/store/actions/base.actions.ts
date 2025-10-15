import { IContainer, ETokens } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAction } from "../slices";
import { serializeError } from "@/utils/error.utils";
import { EActionKeys, EActionStatus, ActionDto } from "@/types/actions.types";

const baseAction = <T extends EActionKeys>(
	actionType: T,
	actionFunction: (container: IContainer, dto?: ActionDto<T>) => Promise<void>
) => {
	return createAsyncThunk(
		actionType,
		async (dto: ActionDto<T>, { rejectWithValue, extra }) => {
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
				await actionFunction(container, dto);
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

type CreatedActions<T extends Partial<ActionConfig>> = {
	[K in keyof T]: ActionDto<K & EActionKeys> extends null
		? () => ReturnType<typeof baseAction>
		: (dto: ActionDto<K & EActionKeys>) => ReturnType<typeof baseAction>;
};

const createBaseActions = <T extends Partial<ActionConfig>>(
	config: T
): CreatedActions<T> => {
	const actions = {} as CreatedActions<T>;

	for (const [actionKey, { serviceToken, methodName }] of Object.entries(
		config
	)) {
		actions[actionKey as keyof T] = ((dto?: any) =>
			baseAction(
				actionKey as EActionKeys,
				async (container, actionDto) => {
					const service = container.get(serviceToken);
					await (service as any)[methodName](actionDto);
				}
			)(dto)) as any;
	}

	return actions;
};

export const createActions = <T extends Partial<ActionConfig>>(config: T) => {
	const actions = createBaseActions(config);

	const typedActions = {} as {
		[K in keyof T]: ActionDto<K & EActionKeys> extends null
			? () => ReturnType<CreatedActions<T>[K]>
			: (
					dto: ActionDto<K & EActionKeys>
			  ) => ReturnType<CreatedActions<T>[K]>;
	};

	for (const actionKey of Object.keys(config)) {
		const key = actionKey as keyof T;
		typedActions[key] = actions[key] as any;
	}

	return typedActions;
};
