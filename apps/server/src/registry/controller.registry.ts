import type { HttpMethod } from "@/types";
import type { Request, Response, Application } from "express";
import { Container } from "@/container/index.container";
import { logger } from "@matcha/shared";

interface RouteInfo {
	method: HttpMethod;
	path: string;
	handler: string;
	instance: new (container: any) => any;
}

class ControllerRegistry {
	private static readonly routes: RouteInfo[] = [];
	private static readonly instances = new Map<string, any>();
	private static container = new Container();

	public static registerRoute(route: RouteInfo): void {
		this.routes.push(route);
	}

	public static get containerInstance(): Container {
		return this.container;
	}

	public static setupRoutes(app: Application): void {
		const routesByPath = new Map<string, RouteInfo[]>();

		this.routes.forEach((route) => {
			if (!routesByPath.has(route.path)) {
				routesByPath.set(route.path, []);
			}
			routesByPath.get(route.path)!.push(route);
		});

		routesByPath.forEach((routes, path) => {
			routes.forEach((route) => {
				const method = route.method.toLowerCase();

				const instanceKey = route.instance.name;
				if (!this.instances.has(instanceKey)) {
					this.instances.set(
						instanceKey,
						new route.instance(this.container)
					);
				}

				const controllerInstance = this.instances.get(instanceKey);
				const handler =
					controllerInstance[route.handler].bind(controllerInstance);

				const loggedHandler = (req: Request, res: Response) => {
					logger.debug(
						`Route called: ${route.method} ${route.path}`,
						{
							handler: route.handler,
							controller: instanceKey,
							ip: req.ip,
							userAgent: req.get("User-Agent"),
						}
					);
					return handler(req, res);
				};

				(app as any)[method](route.path, loggedHandler);
			});
		});
	}
}

export { ControllerRegistry };
