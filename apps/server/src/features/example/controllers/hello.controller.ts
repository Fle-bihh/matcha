import { Request, Response } from "express";
import { config } from "../../../config/config.js";
import { APP_NAME } from "@matcha/shared";

export class HelloController {
	public sayHello(req: Request, res: Response): void {
		res.json({
			message: `Hello from ${APP_NAME} backend, DB=${config.db.name}`,
		});
	}
}
