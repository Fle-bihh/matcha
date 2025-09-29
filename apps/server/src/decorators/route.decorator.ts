import "reflect-metadata";
import type { HttpMethod } from "@/types";
import { ControllerRegistry } from "@/registry/controller.registry";
import {
	buildApiRoute,
	type RouteGroups,
	type RouteKeys,
} from "@/constants/routes.constants";
import {
	METADATA_KEYS,
	type RouteMetadata,
} from "@/constants/metadata.constants";

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

		// Stocker les métadonnées avec reflect-metadata
		const metadata: RouteMetadata = {
			method,
			path: route,
			group: group as string,
			key: key as string,
		};
		Reflect.defineMetadata(
			METADATA_KEYS.ROUTE,
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
