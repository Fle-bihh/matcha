import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { ReportService } from "@/services";
import { auth, route, validate } from "@/decorators";
import { CreateReportDtoSchema } from "@matcha/shared";

export class ReportController extends BaseController {
	private get reportService(): ReportService {
		return this.container.get<ReportService>(ETokens.ReportService);
	}

	@auth()
	@validate(CreateReportDtoSchema, "body")
	@route("POST", "report")
	private async createReport(req: Request, res: Response): Promise<void> {
		const { id } = req.user!;
		const result = await this.reportService.createReport(
			id,
			req.validated?.body,
		);
		this.sendResult(res, result);
	}
}
