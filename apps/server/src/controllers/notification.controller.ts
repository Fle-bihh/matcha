import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { NotificationService } from "@/services";
import { auth, paginate, route, validate } from "@/decorators";

export class NotificationController extends BaseController {
	private get notificationService(): NotificationService {
		return this.container.get<NotificationService>(
			ETokens.NotificationService,
		);
	}

	@auth()
	@paginate()
	@route("GET", "get-notifications")
	private async createNotification(
		req: Request,
		res: Response,
	): Promise<void> {
		const userId = req.user!.user_id;
		const pagination = req.pagination!;
		const serviceResponse = await this.notificationService.getNotifications(
			userId,
			pagination,
		);
		this.sendResult(res, serviceResponse);
	}

	@auth()
	@route("PATCH", "read-notifications")
	private async readNotifications(
		req: Request,
		res: Response,
	): Promise<void> {
		const userId = req.user!.user_id;
		const response =
			await this.notificationService.readNotifications(userId);
		this.sendResult(res, response);
	}
}
