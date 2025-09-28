import type { Request, Response } from "express";
import { Route } from "@/decorators/route.decorator";
import { ApiDocs } from "@/decorators/api-docs.decorator";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types/container.types";
import { Auth } from "@/decorators/auth.decorator";
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
