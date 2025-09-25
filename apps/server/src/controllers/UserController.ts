import type { Request, Response } from "express";
import { Route } from "@/decorators/Route";
import { ApiDocs } from "@/decorators/ApiDocs";
import { BaseController } from "./BaseController";
import { ETokens } from "@/types/container";
import { Auth } from "@/decorators/Auth";
import { UserService } from "@/services";

export class UserController extends BaseController {
	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}

	@Route("GET", "user", "all")
	// @Auth()
	@ApiDocs(" Retrieve all users")
	private async getAllUsers(req: Request, res: Response): Promise<void> {
		const testValue = await this.userService.getAllUsers();
		res.status(testValue.statusCode).send(testValue);
	}
}
