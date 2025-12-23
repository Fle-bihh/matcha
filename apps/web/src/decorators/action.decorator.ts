import { ServiceResponse } from "@/types";

export interface ActionOptions {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
}

const ACTION_METADATA_KEY = Symbol("action:options");

export function action(options: ActionOptions = {}) {
  return function <T extends (...args: any[]) => Promise<ServiceResponse>>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    Reflect.defineMetadata(ACTION_METADATA_KEY, options, target, propertyKey);
    return descriptor;
  };
}

export function getActionOptions(
  target: any,
  propertyKey: string
): ActionOptions | undefined {
  return Reflect.getMetadata(ACTION_METADATA_KEY, target, propertyKey);
}
