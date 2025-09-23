import type { HttpMethod } from "@/types/routes";

interface RouteInfo {
	method: HttpMethod;
	path: string;
	handler: string;
	instance: new () => any;
}

class ControllerRegistry {
	private static readonly routes: RouteInfo[] = [];
	private static readonly instances = new Map<string, any>();

	public static registerRoute(route: RouteInfo): void {
		this.routes.push(route);
	}

	public static setupRoutes(app: Express.Application): void {
		this.routes.forEach((route) => {
			const method = route.method.toLowerCase();

			const instanceKey = route.instance.name;
			if (!this.instances.has(instanceKey)) {
				this.instances.set(instanceKey, new route.instance());
			}

			const controllerInstance = this.instances.get(instanceKey);
			const handler =
				controllerInstance[route.handler].bind(controllerInstance);

			(app as any)[method](route.path, handler);
		});
	}
}

export { ControllerRegistry };
