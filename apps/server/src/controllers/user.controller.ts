import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { UserService } from "@/services";

export class UserController extends BaseController {
	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}
}
