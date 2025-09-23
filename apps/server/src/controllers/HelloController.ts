import type { Request, Response } from "express";
import { BaseController } from "@/controllers/BaseController";
import { Controller } from "@/decorators/Controller";

@Controller
export class HelloController extends BaseController {
	constructor() {
		super();
		this.initializeRoutes();
	}

	protected initializeRoutes(): void {
		this.get("HELLO", this.getHello);
	}

	private getHello(req: Request, res: Response): void {
		res.send("Hello World!");
	}
}
