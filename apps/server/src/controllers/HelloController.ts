import type { Request, Response } from "express";
import { Route } from "@/decorators/Route";
import { Validate } from "@/decorators/Validate";
import { ApiDocs } from "@/decorators/ApiDocs";
import { BaseController } from "./BaseController";
import {
	GetHelloRequestSchema,
	GetHealthRequestSchema,
	type GetHelloRequestDto,
	type GetHealthRequestDto,
} from "@/dto";

export class HelloController extends BaseController {
	@Route("GET", "hello", "test")
	@Validate(GetHelloRequestSchema, "query")
	@ApiDocs(
		"GET /api/v1/ - Returns a personalized greeting message based on name and greeting type"
	)
	private getHello(req: Request, res: Response): void {
		const { name, greeting_type } = req.query as GetHelloRequestDto;
		const greetingResponse = this.ctx.HelloService.getGreeting({
			name,
			greeting_type,
		});
		res.status(greetingResponse.statusCode).send(greetingResponse);
	}

	@Route("GET", "hello", "health")
	@Validate(GetHealthRequestSchema, "query")
	@ApiDocs(
		"GET /api/v1/health - Returns application health status with optional detailed information"
	)
	private getHealth(req: Request, res: Response): void {
		const { include_details } = req.query as GetHealthRequestDto;
		const healthStatusResponse = this.ctx.HelloService.getHealthStatus({
			include_details,
		});
		res.status(healthStatusResponse.statusCode).send(healthStatusResponse);
	}

	@Route("GET", "hello", "db-test")
	@ApiDocs(
		"GET /api/v1/db-test - Tests database connectivity and returns connection status"
	)
	private async getDbTest(req: Request, res: Response): Promise<void> {
		const testValue = await this.ctx.HelloService.getTestValue();
		res.status(testValue.statusCode).send(testValue);
	}
}
