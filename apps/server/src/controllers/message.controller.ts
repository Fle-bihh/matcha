import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { MessageService } from "@/services";
import { auth, route, validate, paginate } from "@/decorators";
import {
	CreateUserMessageDtoSchema,
	MatchIdParamsDtoSchema,
} from "@matcha/shared";

export class MessageController extends BaseController {
	private get messageService(): MessageService {
		return this.container.get<MessageService>(ETokens.MessageService);
	}

	@auth()
	@validate(CreateUserMessageDtoSchema, "body")
	@route("POST", "create-message")
	private async createMessage(req: Request, res: Response): Promise<void> {
		const { user_id } = req.user!;
		const result = await this.messageService.createUserMessage(
			user_id,
			req.validated?.body,
		);
		this.sendResult(res, result);
	}

	@auth()
	@paginate()
	@validate(MatchIdParamsDtoSchema, "params")
	@route("GET", "get-messages")
	private async getMessages(req: Request, res: Response): Promise<void> {
		const { user_id } = req.user!;
		const { id: matchId } = req.validated!.params;
		const result = await this.messageService.getMessages(
			user_id,
			matchId,
			req.pagination!,
		);
		this.sendResult(res, result);
	}
}
