import type { HttpMethod } from "@/types/routes";
import { ControllerRegistry } from "@/registry/ControllerRegistry";
import {
	buildApiRoute,
	type RouteGroups,
	type RouteKeys,
} from "@/constants/routes";

export function Route<T extends RouteGroups, K extends RouteKeys<T>>(
	method: HttpMethod,
	group: T,
	key: K
) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		ControllerRegistry.registerRoute({
			method,
			path: buildApiRoute(group, key),
			handler: propertyKey,
			instance: target.constructor,
		});
	};
}
