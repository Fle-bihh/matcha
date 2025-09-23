import { buildApiRoute, RouteKeys } from "@/constants/routes";
import type { Route, RouteHandler, HttpMethod } from "@/types/routes";

export abstract class BaseController {
	protected readonly routes: Route[] = [];

	protected addRoute(
		method: HttpMethod,
		path: RouteKeys,
		handler: RouteHandler
	): void {
		this.routes.push({
			method,
			path: buildApiRoute(path),
			handler: handler.bind(this),
		});
	}

	protected get(path: RouteKeys, handler: RouteHandler): void {
		this.addRoute("GET", path, handler);
	}

	protected post(path: RouteKeys, handler: RouteHandler): void {
		this.addRoute("POST", path, handler);
	}

	protected put(path: RouteKeys, handler: RouteHandler): void {
		this.addRoute("PUT", path, handler);
	}

	protected delete(path: RouteKeys, handler: RouteHandler): void {
		this.addRoute("DELETE", path, handler);
	}

	protected patch(path: RouteKeys, handler: RouteHandler): void {
		this.addRoute("PATCH", path, handler);
	}

	public getRoutes(): readonly Route[] {
		return this.routes;
	}

	protected abstract initializeRoutes(): void;
}
