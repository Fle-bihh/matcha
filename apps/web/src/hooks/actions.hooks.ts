import { useDispatch, useSelector } from "react-redux";
import { EActionKeys, EActionStatus, IActionData } from "@/types/actions.types";
import { useCallback, useMemo } from "react";

const selectAction = <T extends EActionKeys>(action: T) => {
  return (state: any): IActionData | undefined => state?.actions?.[action];
};

export const useActionsData = <T extends EActionKeys>(actions: T[]) => {
  const actionData = actions.map((action) => useSelector(selectAction(action)));

  return useMemo(() => {
    const isLoading = actionData.some(
      (data) => data?.status === EActionStatus.Loading
    );
    const firstError = actionData.find((data) => data?.error)?.error;
    const hasError = Boolean(firstError);
    const isSuccess = actionData.some(
      (data) => data?.status === EActionStatus.Success
    );

    return {
      isLoading,
      error: firstError?.message || null,
      hasError,
      isSuccess,
    };
  }, [actionData]);
};

export const useDispatchAction = () => {
  const dispatch = useDispatch();
  return useCallback(
    <T extends any[]>(action: (...args: T) => any) =>
      (...args: T) =>
        dispatch(action(...args)),
    [dispatch]
  );
};

export const useDispatchActions = <
  T extends Record<string, (...args: any[]) => any>
>(
  actions: T
): T => {
  const dispatch = useDispatch();
  return useMemo(
    () =>
      Object.entries(actions).reduce(
        (acc, [key, action]) => ({
          ...acc,
          [key]: (...args: any[]) => dispatch(action(...args)),
        }),
        {} as T
      ),
    [dispatch, actions]
  );
};
