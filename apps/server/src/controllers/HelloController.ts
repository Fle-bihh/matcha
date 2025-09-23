import type { Request, Response } from "express";
import { Route } from "@/decorators/Route";
import { ValidateZod } from "@/decorators/ValidateZod";
import { BaseController } from "./BaseController";
import {
	GetHelloRequestSchema,
	GetHealthRequestSchema,
	type GetHelloRequestDto,
	type GetHealthRequestDto,
} from "@/dto";

export class HelloController extends BaseController {
	@Route("GET", "HELLO", "test")
	@ValidateZod(GetHelloRequestSchema, "query")
	private getHello(req: Request, res: Response): void {
		const { name, greeting_type } = req.query as GetHelloRequestDto;
		const result = this.ctx.HelloService.getGreeting(name, greeting_type);
		res.json(result);
	}

	@Route("GET", "HELLO", "health")
	@ValidateZod(GetHealthRequestSchema, "query")
	private getHealth(req: Request, res: Response): void {
		const { include_details } = req.query as GetHealthRequestDto;
		const healthStatus =
			this.ctx.HelloService.getHealthStatus(include_details);
		res.json(healthStatus);
	}

	@Route("GET", "HELLO", "db-test")
	private async getDbTest(req: Request, res: Response): Promise<void> {
		try {
			const testValue = await this.ctx.DatabaseService.getTestValue();
			res.json({
				status: "success",
				message: testValue,
				timestamp: new Date().toISOString(),
			});
		} catch (error) {
			res.status(500).json({
				status: "error",
				message: "Database connection failed",
				error: (error as Error).message,
			});
		}
	}
}
