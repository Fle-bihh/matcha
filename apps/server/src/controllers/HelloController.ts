import type { Request, Response } from "express";
import { Route } from "@/decorators/Route";
import { Validate } from "@/decorators/Validate";
import { ApiDocs } from "@/decorators/ApiDocs";
import { BaseController } from "./BaseController";
import { ETokens } from "@/types/container";
import { HelloService } from "@/services";
import {
	GetHelloRequestSchema,
	GetHealthRequestSchema,
	type GetHelloRequestDto,
	type GetHealthRequestDto,
} from "@/dto";
import { Auth } from "@/decorators/Auth";

export class HelloController extends BaseController {
	private get helloService(): HelloService {
		return this.container.get<HelloService>(ETokens.HelloService);
	}
	@Route("GET", "hello", "test")
	@Validate(GetHelloRequestSchema, "query")
	@ApiDocs(
		"Returns a personalized greeting message based on name and greeting type"
	)
	private getHello(req: Request, res: Response): void {
		const { name, greeting_type } = req.query as GetHelloRequestDto;
		const greetingResponse = this.helloService.getGreeting({
			name,
			greeting_type,
		});
		res.status(greetingResponse.statusCode).send(greetingResponse);
	}

	@Route("GET", "hello", "health")
	@Validate(GetHealthRequestSchema, "query")
	@ApiDocs(
		"Returns application health status with optional detailed information"
	)
	private getHealth(req: Request, res: Response): void {
		const { include_details } = req.query as GetHealthRequestDto;
		const healthStatusResponse = this.helloService.getHealthStatus({
			include_details,
		});
		res.status(healthStatusResponse.statusCode).send(healthStatusResponse);
	}

	@Route("GET", "hello", "db-test")
	@Auth()
	@ApiDocs("Tests database connectivity and returns connection status")
	private async getDbTest(req: Request, res: Response): Promise<void> {
		const testValue = await this.helloService.getTestValue();
		res.status(testValue.statusCode).send(testValue);
	}
}
