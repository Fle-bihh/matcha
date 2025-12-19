import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserService } from "./user.service";
import { EmailVerificationService } from "./email-verification.service";
import {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  logger,
  AuthenticateResponseDto,
  LoginRequestDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from "@matcha/shared";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt.utils";
import { HashUtils } from "@/utils/hash.utils";
import { config } from "@/config";

export class AuthService extends BaseService {
  constructor(container: IContainer) {
    super(container);
  }

  private get userService(): UserService {
    return this.container.get<UserService>(ETokens.UserService);
  }

  private get emailVerificationService(): EmailVerificationService {
    return this.container.get<EmailVerificationService>(
      ETokens.EmailVerificationService
    );
  }

  public async authenticate(
    userId: number
  ): Promise<ServiceResponse<AuthenticateResponseDto | null>> {
    try {
      const userResponse = await this.userService.findById(userId);

      if (!userResponse.success || !userResponse.responseObject) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      return ServiceResponse.success("User authenticated successfully", {
        user: userResponse.responseObject,
      });
    } catch (error) {
      return ServiceResponse.failure(
        "Authentication failed",
        null,
        StatusCodes.UNAUTHORIZED
      );
    }
  }

  public async register(
    dto: RegisterRequestDto
  ): Promise<ServiceResponse<RegisterResponseDto | null>> {
    try {
      let existingUserResponse = await this.userService.findByEmail(dto.email);

      if (
        !existingUserResponse.success ||
        existingUserResponse.responseObject
      ) {
        return ServiceResponse.failure(
          "Email already in use",
          null,
          StatusCodes.CONFLICT
        );
      }

      existingUserResponse = await this.userService.findByUsername(
        dto.username
      );

      if (
        !existingUserResponse.success ||
        existingUserResponse.responseObject
      ) {
        return ServiceResponse.failure(
          "Username already in use",
          null,
          StatusCodes.CONFLICT
        );
      }

      const hashedPassword = await HashUtils.hashPassword(dto.password);

      const userData = {
        ...dto,
        password: hashedPassword,
      };

      const userResponse = await this.userService.createUser(userData);

      if (!userResponse.success || !userResponse.responseObject) {
        return ServiceResponse.failure(
          userResponse.message,
          null,
          userResponse.statusCode
        );
      }

      const { accessToken, refreshToken } = JwtUtils.generateTokens(
        userResponse.responseObject
      );

      const tokenResponse =
        await this.emailVerificationService.createVerificationToken(
          userResponse.responseObject.id
        );

      if (tokenResponse.success && tokenResponse.responseObject) {
        const verificationLink = `${config.webUrl}/confirm-email?token=${tokenResponse.responseObject}`;

        await this.mailService.sendEmail({
          to: userResponse.responseObject.email,
          subject: "Verify Your Email - Matcha",
          text: `Hello ${userResponse.responseObject.username},\n\nThank you for registering! Please verify your email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nMatcha Team`,
        });
      }

      return ServiceResponse.success("User registered successfully", {
        accessToken,
        refreshToken,
        user: userResponse.responseObject,
      });
    } catch (error) {
      logger.error("Error in register:", error);
      return ServiceResponse.failure(
        "Error creating user",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async login(
    dto: LoginRequestDto
  ): Promise<ServiceResponse<LoginResponseDto | null>> {
    try {
      const { username, password } = dto;
      const userResponse = await this.userService.findByUsername(
        username,
        true
      );

      if (!userResponse.success || !userResponse.responseObject) {
        return ServiceResponse.failure(
          "Invalid credentials",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const userWithPassword = userResponse.responseObject;
      const isPasswordValid = await HashUtils.comparePassword(
        password,
        userWithPassword.password
      );

      if (!isPasswordValid) {
        return ServiceResponse.failure(
          "Invalid credentials",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const { password: _, ...user } = userWithPassword;
      const { accessToken, refreshToken } = JwtUtils.generateTokens(user);

      await this.mailService.sendEmail({
        to: user.email,
        subject: "New Login Notification",
        text: `Hello ${user.username},\n\nWe noticed a new login to your account. If this was you, you can safely ignore this email. If you did not log in, please reset your password immediately.\n\nBest regards,\nMatcha Team`,
      });

      return ServiceResponse.success("User logged in successfully", {
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      return ServiceResponse.failure(
        "Error during login",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async refreshToken(
    dto: RefreshTokenRequestDto
  ): Promise<ServiceResponse<RefreshTokenResponseDto | null>> {
    try {
      const { userId } = JwtUtils.verifyRefreshToken(dto.refreshToken);

      const userResponse = await this.userService.findById(userId);

      if (!userResponse.success || !userResponse.responseObject) {
        return ServiceResponse.failure(
          "Invalid refresh token",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const user = userResponse.responseObject;
      const { accessToken, refreshToken } = JwtUtils.generateTokens(user);

      return ServiceResponse.success("Token refreshed successfully", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return ServiceResponse.failure(
        "Invalid or expired refresh token",
        null,
        StatusCodes.UNAUTHORIZED
      );
    }
  }

  public async verifyEmail(
    dto: VerifyEmailRequestDto
  ): Promise<ServiceResponse<VerifyEmailResponseDto | null>> {
    try {
      const result = await this.emailVerificationService.verifyEmail(dto.token);

      if (!result.success) {
        return ServiceResponse.failure(result.message, null, result.statusCode);
      }

      return ServiceResponse.success("Email verified successfully", {
        success: true,
      });
    } catch (error) {
      logger.error("Error in verifyEmail:", error);
      return ServiceResponse.failure(
        "Error verifying email",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
