import type { HttpMethod } from "@/types";
import type { Request, Response, Application } from "express";
import { Container } from "@/container/container";
import { logger } from "@matcha/shared";

interface RouteInfo {
	method: HttpMethod;
	path: string;
	handler: string;
	instance: new (container: any) => any;
}

export class ControllerRegistry {
	private static readonly routes: RouteInfo[] = [];
	private readonly controllerInstances = new Map<string, any>();
	private readonly container: Container;

	constructor(container: Container) {
		this.container = container;
	}

	public static registerRoute(route: RouteInfo): void {
		this.routes.push(route);
	}

	public setupRoutes(app: Application): void {
		const routesByPath = new Map<string, RouteInfo[]>();

		ControllerRegistry.routes.forEach((route) => {
			if (!routesByPath.has(route.path)) {
				routesByPath.set(route.path, []);
			}
			routesByPath.get(route.path)!.push(route);
		});

		routesByPath.forEach((routes, path) => {
			routes.forEach((route) => {
				this.setupRoute(app, route);
			});
		});

		logger.info(`Registered ${ControllerRegistry.routes.length} routes`);
	}

	private setupRoute(app: Application, route: RouteInfo): void {
		const method = route.method.toLowerCase();
		const instanceKey = route.instance.name;

		if (!this.controllerInstances.has(instanceKey)) {
			logger.debug(`Creating controller instance: ${instanceKey}`);
			this.controllerInstances.set(
				instanceKey,
				new route.instance(this.container)
			);
		}

		const controllerInstance = this.controllerInstances.get(instanceKey);
		const handler =
			controllerInstance[route.handler].bind(controllerInstance);

		const loggedHandler = (req: Request, res: Response) => {
			logger.debug(`Route called: ${route.method} ${route.path}`, {
				handler: route.handler,
				controller: instanceKey,
				ip: req.ip,
				userAgent: req.get("User-Agent"),
			});
			return handler(req, res);
		};

		(app as any)[method](route.path, loggedHandler);

		logger.debug(
			`Route registered: ${route.method} ${route.path} -> ${instanceKey}.${route.handler}`
		);
	}

	public static getRoutes(): RouteInfo[] {
		return [...this.routes];
	}

	public static clearRoutes(): void {
		this.routes.length = 0;
	}
}
