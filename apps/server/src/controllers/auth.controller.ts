import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { AuthService } from "@/services";
import { auth, route, validate } from "@/decorators";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
} from "@matcha/shared";

export class AuthController extends BaseController {
  private get authService(): AuthService {
    return this.container.get<AuthService>(ETokens.AuthService);
  }

  @route("POST", "register")
  @validate(RegisterRequestSchema, "body")
  private async register(req: Request, res: Response): Promise<void> {
    const result = await this.authService.register(req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @auth()
  @route("GET", "authenticate")
  private async authenticate(req: Request, res: Response): Promise<void> {
    const { id } = req.user!;
    const result = await this.authService.authenticate(id);
    res.status(result.statusCode).send(result);
  }

  @route("POST", "login")
  @validate(LoginRequestSchema, "body")
  private async login(req: Request, res: Response): Promise<void> {
    const result = await this.authService.login(req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @route("POST", "refresh")
  @validate(RefreshTokenRequestSchema, "body")
  private async refresh(req: Request, res: Response): Promise<void> {
    const result = await this.authService.refreshToken(req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @route("POST", "logout")
  private async logout(req: Request, res: Response): Promise<void> {
    // const result = await this.authService.logout(token);
    // res.status(result.statusCode).send(result);
  }
}
