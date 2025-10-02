import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { AuthService } from "@/services";
import { route, validate } from "@/decorators";
import {
	RegisterRequestSchema,
	LoginRequestSchema,
	RefreshTokenRequestSchema,
} from "@/dto";

export class AuthController extends BaseController {
	private get authService(): AuthService {
		return this.container.get<AuthService>(ETokens.AuthService);
	}

	@route("POST", "register")
	@validate(RegisterRequestSchema, "body")
	private async register(req: Request, res: Response): Promise<void> {
		const result = await this.authService.register(req.body);
		res.status(result.statusCode).send(result);
	}

	@route("POST", "login")
	@validate(LoginRequestSchema, "body")
	private async login(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;
		const result = await this.authService.login(email, password);
		res.status(result.statusCode).send(result);
	}

	@route("POST", "refresh")
	@validate(RefreshTokenRequestSchema, "body")
	private async refresh(req: Request, res: Response): Promise<void> {
		const result = await this.authService.refreshToken(req.body);
		res.status(result.statusCode).send(result);
	}

	@route("POST", "logout")
	private async logout(req: Request, res: Response): Promise<void> {
		// const result = await this.authService.logout(token);
		// res.status(result.statusCode).send(result);
	}
}
