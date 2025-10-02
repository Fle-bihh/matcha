import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { UserService } from "@/services";
import { route, auth } from "@/decorators";

export class UserController extends BaseController {
	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}
}
