import type { Request, Response } from "express";
import { Route } from "@/decorators/Route";

export class HelloController {
	@Route("GET", "HELLO", "test")
	private getHello(_: Request, res: Response): void {
		res.send("Hello World!");
	}

	@Route("GET", "HELLO", "health")
	private getHealth(_: Request, res: Response): void {
		res.json({ status: "healthy", timestamp: new Date().toISOString() });
	}
}
