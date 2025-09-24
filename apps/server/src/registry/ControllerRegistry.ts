import type { HttpMethod } from "@/types/routes";
import type { Request, Response, Application } from "express";

interface RouteInfo {
	method: HttpMethod;
	path: string;
	handler: string;
	instance: new () => any;
	apiDocs?: string;
}

class ControllerRegistry {
	private static readonly routes: RouteInfo[] = [];
	private static readonly instances = new Map<string, any>();

	public static registerRoute(route: RouteInfo): void {
		this.routes.push(route);
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
					this.instances.set(instanceKey, new route.instance());
				}

				const controllerInstance = this.instances.get(instanceKey);
				const handler =
					controllerInstance[route.handler].bind(controllerInstance);

				(app as any)[method](route.path, handler);
			});

			const allowedMethods = routes.map((r) => r.method).join(", ");
			const apiDocsForPath = routes
				.filter((r) => r.apiDocs)
				.map((r) => ({
					method: r.method,
					description: r.apiDocs,
				}));

			app.options(path, (req: Request, res: Response) => {
				res.setHeader("Allow", allowedMethods);
				res.setHeader("Access-Control-Allow-Methods", allowedMethods);
				res.setHeader(
					"Access-Control-Allow-Headers",
					"Content-Type, Authorization"
				);

				if (apiDocsForPath.length > 0) {
					res.json({
						path: path,
						allowedMethods: allowedMethods.split(", "),
						documentation: apiDocsForPath,
					});
				} else {
					res.json({
						path: path,
						allowedMethods: allowedMethods.split(", "),
					});
				}
			});
		});
	}
}

export { ControllerRegistry };
