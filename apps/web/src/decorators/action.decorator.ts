import { ServiceResponse } from "@/types";

export function action() {
	return function <
		T extends (...args: any[]) => Promise<ServiceResponse<string>>
	>(
		target: any,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<T>
	): TypedPropertyDescriptor<T> {
		return descriptor;
	};
}
