import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { UserService } from "@/services";
import { Route, Auth } from "@/decorators";

export class UserController extends BaseController {
	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}

	@Route("GET", "all")
	@Auth()
	private async getAllUsers(req: Request, res: Response): Promise<void> {
		const testValue = await this.userService.getAllUsers();
		res.status(testValue.statusCode).send(testValue);
	}
}
