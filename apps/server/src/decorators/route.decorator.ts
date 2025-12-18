import type { HttpMethod, RouteMetadata } from "@/types";
import { ControllerRegistry } from "@/registry/controller.registry";
import {
  buildApiRouteUnsafe,
  type RouteGroups,
  type AllRouteKeys,
  API_ROUTES,
} from "@matcha/shared";
import { logger } from "@matcha/shared";

function getControllerGroup(className: string): RouteGroups {
  const match = className.match(/^(\w+)Controller$/);
  if (!match) {
    throw new Error(
      `Invalid controller name: ${className}. Must end with 'Controller'`
    );
  }
  const groupName = match[1].toLowerCase();

  if (!(groupName in API_ROUTES)) {
    throw new Error(
      `Unknown route group: ${groupName}. Available groups: ${Object.keys(
        API_ROUTES
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

    const routeGroup = API_ROUTES[controllerGroup];
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

    ControllerRegistry.registerRoute({
      method,
      path: route,
      handler: propertyKey,
      instance: target.constructor,
    });
  };
}
