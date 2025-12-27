import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { AuthService } from "@/services";
import { auth, route, validate } from "@/decorators";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  VerifyEmailRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  SendChangeEmailVerificationRequestSchema,
  ChangeEmailRequestSchema,
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
    res.status(200).send({ success: true });
  }

  @route("POST", "verify-email")
  @validate(VerifyEmailRequestSchema, "body")
  private async verifyEmail(req: Request, res: Response): Promise<void> {
    const result = await this.authService.verifyEmail(req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @auth()
  @route("GET", "resend-verification-email")
  private async resendVerificationEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.user!;
    const result = await this.authService.resendVerificationEmail(id);
    res.status(result.statusCode).send(result);
  }

  @route("POST", "forgot-password")
  @validate(ForgotPasswordRequestSchema, "body")
  private async forgotPassword(req: Request, res: Response): Promise<void> {
    const result = await this.authService.forgotPassword(req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @route("POST", "reset-password")
  @validate(ResetPasswordRequestSchema, "body")
  private async resetPassword(req: Request, res: Response): Promise<void> {
    const result = await this.authService.resetPassword(req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @auth()
  @route("POST", "send-change-email-verification")
  @validate(SendChangeEmailVerificationRequestSchema, "body")
  private async sendChangeEmailVerification(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.user!;
    const result = await this.authService.sendChangeEmailVerification(
      id,
      req.validated?.body
    );
    res.status(result.statusCode).send(result);
  }

  @auth()
  @route("POST", "change-email")
  @validate(ChangeEmailRequestSchema, "body")
  private async changeEmail(req: Request, res: Response): Promise<void> {
    const result = await this.authService.changeEmail(req.validated?.body);
    res.status(result.statusCode).send(result);
  }
}
