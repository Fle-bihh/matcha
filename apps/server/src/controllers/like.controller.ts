import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { LikeService } from "@/services";
import { auth, route, validate } from "@/decorators";
import {
	CreateLikeDtoSchema,
	UnlikeUserDtoSchema,
	UserIdParamsDtoSchema,
} from "@matcha/shared";

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
			req.validated?.body,
		);
		this.sendResult(res, result);
	}

	@auth()
	@validate(UserIdParamsDtoSchema, "params")
	@route("DELETE", "unlike")
	private async unlikeUser(req: Request, res: Response): Promise<void> {
		const { id } = req.user!;
		const { id: liked_id } = req.validated!.params;
		const result = await this.likeService.unlikeUser(id, liked_id);
		this.sendResult(res, result);
	}
}
