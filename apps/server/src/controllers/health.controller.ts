import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { HealthService } from "@/services";
import { GetHealthRequestSchema, type GetHealthRequestDto } from "@/dto";
import { Route, Validate, Auth } from "@/decorators";

export class HealthController extends BaseController {
	private get healthService(): HealthService {
		return this.container.get<HealthService>(ETokens.HealthService);
	}

	@Route("GET", "get-health")
	@Validate(GetHealthRequestSchema, "query")
	private getHealth(req: Request, res: Response): void {
		const { include_details } = req.validated?.query as GetHealthRequestDto;
		const healthStatusResponse = this.healthService.getHealthStatus({
			include_details,
		});
		res.status(healthStatusResponse.statusCode).send(healthStatusResponse);
	}
}
