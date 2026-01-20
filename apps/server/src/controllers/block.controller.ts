import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { BlockService } from "@/services";
import { auth, route, validate } from "@/decorators";
import { CreateBlockDtoSchema } from "@matcha/shared";

export class BlockController extends BaseController {
	private get blockService(): BlockService {
		return this.container.get<BlockService>(ETokens.BlockService);
	}

	@auth()
	@validate(CreateBlockDtoSchema, "body")
	@route("POST", "block")
	private async createBlock(req: Request, res: Response): Promise<void> {
		const { id } = req.user!;
		const result = await this.blockService.createBlock(
			id,
			req.validated?.body,
		);
		this.sendResult(res, result);
	}
}
