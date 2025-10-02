import "reflect-metadata";
import type { HttpMethod, RouteMetadata } from "@/types";
import { ControllerRegistry } from "@/registry/controller.registry";
import {
	buildApiRouteUnsafe,
	type RouteGroups,
	type AllRouteKeys,
	ROUTES,
} from "@/constants/routes.constants";
import { METADATA_KEYS } from "@/constants/metadata.constants";
import { logger } from "@matcha/shared";

function getControllerGroup(className: string): RouteGroups {
	const match = className.match(/^(\w+)Controller$/);
	if (!match) {
		throw new Error(
			`Invalid controller name: ${className}. Must end with 'Controller'`
		);
	}
	const groupName = match[1].toLowerCase();

	if (!(groupName in ROUTES)) {
		throw new Error(
			`Unknown route group: ${groupName}. Available groups: ${Object.keys(
				ROUTES
			).join(", ")}`
		);
	}

	return groupName as RouteGroups;
}

export function route(method: HttpMethod, key: AllRouteKeys) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const controllerGroup = getControllerGroup(target.constructor.name);

		const routeGroup = ROUTES[controllerGroup];
		if (!routeGroup || !(key in routeGroup)) {
			logger.warn(
				`Invalid route key "${String(key)}" for controller ${
					target.constructor.name
				}. Available keys: ${Object.keys(routeGroup || {}).join(
					", "
				)}. Route not registered.`
			);

			return;
		}

		const route = buildApiRouteUnsafe(controllerGroup, key);

		const metadata: RouteMetadata = {
			method,
			path: route,
			key,
		};
		Reflect.defineMetadata(
			METADATA_KEYS.Route,
			metadata,
			target,
			propertyKey
		);

		ControllerRegistry.registerRoute({
			method,
			path: route,
			handler: propertyKey,
			instance: target.constructor,
		});
	};
}
