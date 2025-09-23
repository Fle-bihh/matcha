export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

export const ROUTES = {
	HELLO: {
		test: "/",
		health: "/health",
	},
} as const;

export type RouteGroups = keyof typeof ROUTES;

export type RouteKeys<T extends RouteGroups> = keyof (typeof ROUTES)[T];

export type RouteValue<
	T extends RouteGroups,
	K extends RouteKeys<T>
> = (typeof ROUTES)[T][K];

export function getRoute<T extends RouteGroups, K extends RouteKeys<T>>(
	group: T,
	key: K
): RouteValue<T, K> {
	const routeGroup = ROUTES[group];
	if (!routeGroup) {
		throw new Error(`Route group not found: ${group}`);
	}
	const route = routeGroup[key];
	if (route === undefined) {
		throw new Error(`Route not found: ${group}.${String(key)}`);
	}
	return route;
}

export function buildApiRoute<T extends RouteGroups, K extends RouteKeys<T>>(
	group: T,
	key: K
): string {
	return `${API_PREFIX}${getRoute(group, key)}`;
}
