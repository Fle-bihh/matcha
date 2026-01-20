import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { MatchService } from "@/services";
import { auth, route, validate, paginate } from "@/decorators";
import { MatchesFiltersDtoSchema } from "@matcha/shared";

export class MatchController extends BaseController {
	private get matchService(): MatchService {
		return this.container.get<MatchService>(ETokens.MatchService);
	}

	@auth()
	@paginate()
	@validate(MatchesFiltersDtoSchema, "query")
	@route("GET", "get-matches")
	private async getMatches(req: Request, res: Response): Promise<void> {
		const result = await this.matchService.getMatches(
			req.user?.user_id!,
			req.pagination!,
			req.validated?.query!,
		);
		this.sendResult(res, result);
	}
}
