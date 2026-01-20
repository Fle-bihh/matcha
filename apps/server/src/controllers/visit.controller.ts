import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { VisitService } from "@/services";
import { auth, route, validate, paginate } from "@/decorators";
import { CreateVisitDtoSchema } from "@matcha/shared";

export class VisitController extends BaseController {
	private get visitService(): VisitService {
		return this.container.get<VisitService>(ETokens.VisitService);
	}

	@auth()
	@validate(CreateVisitDtoSchema, "body")
	@route("POST", "create-visit")
	private async createVisit(req: Request, res: Response): Promise<void> {
		const { user_id } = req.user!;
		const result = await this.visitService.createVisit(
			user_id,
			req.validated?.body,
		);
		this.sendResult(res, result);
	}

	@auth()
	@paginate()
	@route("GET", "get-visits")
	private async getVisitsReceived(
		req: Request,
		res: Response,
	): Promise<void> {
		const { user_id } = req.user!;
		const { page, limit } = req.pagination!;
		const result = await this.visitService.getVisitsReceived(
			user_id,
			page,
			limit,
		);
		this.sendResult(res, result);
	}
}
