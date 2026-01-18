import { IContainer, ETokens, ServiceResponse } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAction } from "../slices";
import { serializeError } from "@/utils";
import { EActionKeys, EActionStatus, ActionDto } from "@/types";
import { getActionOptions } from "@/decorators";
import { SnackbarService } from "@/services";

const baseAction = <T extends EActionKeys>(
  actionType: T,
  actionFunction: (
    container: IContainer,
    dto?: ActionDto<T>
  ) => Promise<ServiceResponse>
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

        const response = await actionFunction(container, dto);
        if (!response.success) {
          throw new Error(response.message || "Action failed");
        }

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

type ActionConfig = EActionKeys[];

type CreatedActions<T extends ActionConfig> = {
  [K in T[number]]: ActionDto<K> extends null
    ? () => ReturnType<typeof baseAction>
    : (dto: ActionDto<K>) => ReturnType<typeof baseAction>;
};

const createBaseActions = <T extends ActionConfig>(
  serviceToken: ETokens,
  config: T
): CreatedActions<T> => {
  const actions = {} as CreatedActions<T>;

  for (const actionKey of config) {
    actions[actionKey as T[number]] = ((dto?: any) =>
      baseAction(actionKey as EActionKeys, async (container, actionDto) => {
        const service = container.get(serviceToken);
        const method = (service as any)[actionKey] as (
          dto: any
        ) => Promise<ServiceResponse>;

        const options = getActionOptions(service, actionKey);

        const response = await method.call(service, actionDto);

        const snackbar = container.get<SnackbarService>(
          ETokens.SnackbarService
        );
        if (response.success && options?.showSuccessMessage) {
          snackbar.success(response.message || "Action completed successfully");
        } else if (!response.success && options?.showErrorMessage) {
          snackbar.error(response.message || "Action failed");
        }

        return response;
      })(dto)) as any;
  }

  return actions;
};

export const createActions = <T extends ActionConfig>(
  serviceToken: ETokens,
  config: T
) => {
  const actions = createBaseActions(serviceToken, config);

  const typedActions = {} as {
    [K in T[number]]: ActionDto<K> extends null
      ? () => ReturnType<CreatedActions<T>[K]>
      : (dto: ActionDto<K>) => ReturnType<CreatedActions<T>[K]>;
  };

  for (const actionKey of config) {
    typedActions[actionKey as T[number]] = actions[
      actionKey as T[number]
    ] as any;
  }

  return typedActions;
};
