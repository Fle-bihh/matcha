import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { LikeService } from "@/services/like.service";
import { auth, route, validate } from "@/decorators";
import { CreateLikeDtoSchema } from "@matcha/shared";

export class LikeController extends BaseController {
	private get likeService(): LikeService {
		return this.container.get<LikeService>(ETokens.LikeService);
	}

	@auth()
	@validate(CreateLikeDtoSchema, "body")
	@route("POST", "like")
	private async createLike(req: Request, res: Response): Promise<void> {
		const { id } = req.user!;
		const result = await this.likeService.createLike(
			id,
			req.validated?.body
		);
		this.sendResult(res, result);
	}
}
