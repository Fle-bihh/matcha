import type { HttpMethod } from "@/types/routes.types";
import { ControllerRegistry } from "@/registry/controller.registry";
import {
	buildApiRoute,
	type RouteGroups,
	type RouteKeys,
} from "@/constants/routes.constants";
import { getApiDocs } from "./api-docs.decorator";

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
		const route = buildApiRoute(group, key);

		const apiDocs = getApiDocs(target, propertyKey);
		ControllerRegistry.registerRoute({
			method,
			path: route,
			handler: propertyKey,
			instance: target.constructor,
			apiDocs,
		});
	};
}
