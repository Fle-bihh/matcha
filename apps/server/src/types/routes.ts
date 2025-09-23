import type { Request, Response } from "express";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RouteHandler {
	(req: Request, res: Response): void | Promise<void>;
}

export interface Route {
	readonly method: HttpMethod;
	readonly path: string;
	readonly handler: RouteHandler;
}

export interface IController {
	getRoutes(): readonly Route[];
}
