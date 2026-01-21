export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

export enum ERouteGroups {
	Health = "health",
	User = "user",
	Auth = "auth",
	Like = "like",
	Match = "match",
	Visit = "visit",
	Report = "report",
	Block = "block",
	Message = "message",
	Notification = "notification",
}

export const API_ROUTES = {
	[ERouteGroups.Health]: {
		"get-health": "/",
	},
	[ERouteGroups.User]: {
		"get-users": "/",
		"get-user-by-id": "/:id",
		"update-profile": "/",
		"update-profile-picture": "/picture",
		"update-location": "/location",
	},
	[ERouteGroups.Auth]: {
		register: "/register",
		login: "/login",
		refresh: "/refresh",
		logout: "/logout",
		authenticate: "/authenticate",
		"verify-email": "/verify-email",
		"resend-verification-email": "/resend-verification-email",
		"forgot-password": "/forgot-password",
		"reset-password": "/reset-password",
		"send-change-email-verification": "/send-change-email-verification",
		"change-email": "/change-email",
	},
	[ERouteGroups.Like]: {
		like: "/",
		unlike: "/:id",
	},
	[ERouteGroups.Match]: {
		"get-matches": "/",
	},
	[ERouteGroups.Visit]: {
		"create-visit": "/",
		"get-visits": "/",
	},
	[ERouteGroups.Report]: {
		report: "/",
	},
	[ERouteGroups.Block]: {
		block: "/",
	},
	[ERouteGroups.Message]: {
		"create-message": "/",
		"get-messages": "/:id",
	},
	[ERouteGroups.Notification]: {
		"get-notifications": "/",
	},
} as const;

export type RouteGroups = keyof typeof API_ROUTES;

export type RouteKeys<T extends RouteGroups> = keyof (typeof API_ROUTES)[T];

export type AllRouteKeys = {
	[K in RouteGroups]: RouteKeys<K>;
}[RouteGroups];

export type RouteValue = string;

export function getRoute<T extends RouteGroups, K extends RouteKeys<T>>(
	group: T,
	key: K,
): RouteValue {
	const routeGroup = API_ROUTES[group];
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
	key: K,
): string {
	return `${API_PREFIX}${getRoute(group, key)}`;
}

export function buildApiRouteUnsafe(
	group: RouteGroups,
	key: AllRouteKeys,
): string {
	const routeGroup = API_ROUTES[group];
	if (!routeGroup) {
		throw new Error(`Route group not found: ${group}`);
	}
	const route = routeGroup[key as keyof typeof routeGroup];
	if (route === undefined) {
		throw new Error(`Route not found: ${group}.${String(key)}`);
	}
	return `${API_PREFIX}/${group}${route}`;
}
