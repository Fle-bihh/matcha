export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

export const ROUTES = {
	health: {
		"get-health": "/",
	},
	user: {
		all: "/users",
	},
	auth: {
		register: "/register",
		login: "/login",
		refresh: "/refresh",
		logout: "/logout",
	},
} as const;

export type RouteGroups = keyof typeof ROUTES;

export type RouteKeys<T extends RouteGroups> = keyof (typeof ROUTES)[T];

export type AllRouteKeys = {
	[K in RouteGroups]: RouteKeys<K>;
}[RouteGroups];

export type RouteValue = string;

export function getRoute<T extends RouteGroups, K extends RouteKeys<T>>(
	group: T,
	key: K
): RouteValue {
	const routeGroup = ROUTES[group];
	if (!routeGroup) {
		throw new Error(`Route group not found: ${group}`);
	}
	const route = routeGroup[key];
	if (route === undefined) {
		throw new Error(`Route not found: ${group}.${String(key)}`);
	}
	return `/${group}${route}`;
}

export function buildApiRoute<T extends RouteGroups, K extends RouteKeys<T>>(
	group: T,
	key: K
): string {
	return `${API_PREFIX}${getRoute(group, key)}`;
}

export function buildApiRouteUnsafe(
	group: RouteGroups,
	key: AllRouteKeys
): string {
	const routeGroup = ROUTES[group];
	if (!routeGroup) {
		throw new Error(`Route group not found: ${group}`);
	}
	const route = routeGroup[key as keyof typeof routeGroup];
	if (route === undefined) {
		throw new Error(`Route not found: ${group}.${String(key)}`);
	}
	return `${API_PREFIX}/${group}${route}`;
}
