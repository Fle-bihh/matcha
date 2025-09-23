export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

export const ROUTES = {
	HELLO: "/",
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];
export type ApiRoute<K extends RouteKeys = RouteKeys> =
	`${typeof API_PREFIX}${(typeof ROUTES)[K]}`;

export function getRoute<K extends RouteKeys>(key: K): (typeof ROUTES)[K] {
	const route = ROUTES[key];
	if (route === undefined) {
		throw new Error(`Route not found: ${key}`);
	}
	return route;
}

export function buildApiRoute<K extends RouteKeys>(key: K): ApiRoute<K> {
	return `${API_PREFIX}${getRoute(key)}` as ApiRoute<K>;
}
