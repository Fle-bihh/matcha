import type { Express } from "express";
import type { IController, Route } from "@/types/routes";

export class Router {
	private readonly app: Express;
	private readonly controllers: IController[] = [];

	constructor(app: Express) {
		this.app = app;
	}

	public addController(controller: IController): void {
		this.controllers.push(controller);
	}

	public setupRoutes(): void {
		this.controllers.forEach((controller) => {
			const routes = controller.getRoutes();
			routes.forEach((route) => {
				this.registerRoute(route);
			});
		});
	}

	private registerRoute(route: Route): void {
		const method = route.method.toLowerCase() as keyof Express;
		(this.app[method] as any)(route.path, route.handler);
	}
}
