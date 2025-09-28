import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { AuthService } from "@/services";
import { Route, ApiDocs, Validate } from "@/decorators";
import { RegisterRequestSchema, LoginRequestSchema } from "@/dto/auth.dto";

export class AuthController extends BaseController {
	private get authService(): AuthService {
		return this.container.get<AuthService>(ETokens.AuthService);
	}

	@Route("POST", "auth", "register")
	@ApiDocs("Register a new user")
	@Validate(RegisterRequestSchema)
	private async register(req: Request, res: Response): Promise<void> {
		const result = await this.authService.register(req.body);
		res.status(result.statusCode).send(result);
	}

	@Route("POST", "auth", "login")
	@ApiDocs("Login user")
	@Validate(LoginRequestSchema)
	private async login(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;
		const result = await this.authService.login(email, password);
		res.status(result.statusCode).send(result);
	}
}
