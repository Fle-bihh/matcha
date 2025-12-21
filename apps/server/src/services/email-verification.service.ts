import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { EmailVerificationRepository } from "@/repositories/email-verification.repository";
import { UserService } from "./user.service";
import { logger } from "@matcha/shared";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { config } from "@/config";

export class EmailVerificationService extends BaseService {
  constructor(container: IContainer) {
    super(container);
  }

  private get emailVerificationRepository(): EmailVerificationRepository {
    return this.container.get<EmailVerificationRepository>(
      ETokens.EmailVerificationRepository
    );
  }

  private get userService(): UserService {
    return this.container.get<UserService>(ETokens.UserService);
  }

  public async createVerificationToken(
    userId: number
  ): Promise<ServiceResponse<string | null>> {
    try {
      const token = crypto.randomBytes(32).toString("hex");

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await this.emailVerificationRepository.deleteByUserId(userId);

      await this.emailVerificationRepository.createVerification(
        userId,
        token,
        expiresAt
      );

      return ServiceResponse.success(
        "Verification token created successfully",
        token
      );
    } catch (error) {
      logger.error("Error creating verification token:", error);
      return ServiceResponse.failure(
        "Error creating verification token",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async sendVerificationEmail(
    userId: number
  ): Promise<ServiceResponse<boolean>> {
    try {
      const userResponse = await this.userService.findById(userId);

      if (!userResponse.success || !userResponse.responseObject) {
        return ServiceResponse.failure(
          "User not found",
          false,
          StatusCodes.NOT_FOUND
        );
      }

      const user = userResponse.responseObject;

      // Check rate limiting: 5 minutes between emails
      const latestVerification =
        await this.emailVerificationRepository.getLatestByUserId(userId);

      if (latestVerification) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const lastEmailDate = new Date(latestVerification.created_at);

        if (lastEmailDate > fiveMinutesAgo) {
          const timeRemaining = Math.ceil(
            (lastEmailDate.getTime() + 5 * 60 * 1000 - Date.now()) / 1000 / 60
          );
          return ServiceResponse.failure(
            `Please wait ${timeRemaining} minute(s) before requesting another verification email.`,
            false,
            StatusCodes.TOO_MANY_REQUESTS
          );
        }
      }

      // Delete all previous verification tokens for this user
      await this.emailVerificationRepository.deleteByUserId(userId);

      const tokenResponse = await this.createVerificationToken(userId);

      if (!tokenResponse.success || !tokenResponse.responseObject) {
        return ServiceResponse.failure(
          "Error creating verification token",
          false,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const verificationLink = `${config.webUrl}/confirm-email?token=${tokenResponse.responseObject}`;

      await this.mailService.sendEmail({
        to: user.email,
        subject: "Verify Your Email - Matcha",
        text: `Hello ${user.username},\n\nThank you for registering! Please verify your email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nMatcha Team`,
      });

      return ServiceResponse.success(
        "Verification email sent successfully",
        true
      );
    } catch (error) {
      logger.error("Error sending verification email:", error);
      return ServiceResponse.failure(
        "Error sending verification email",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async verifyEmail(token: string): Promise<ServiceResponse<boolean>> {
    try {
      const verification = await this.emailVerificationRepository.findByToken(
        token
      );

      if (!verification) {
        return ServiceResponse.failure(
          "Invalid or expired verification token",
          false,
          StatusCodes.BAD_REQUEST
        );
      }

      const marked = await this.emailVerificationRepository.markAsUsed(
        verification.id
      );

      if (!marked) {
        return ServiceResponse.failure(
          "Error marking verification as used",
          false,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const userResponse = await this.userService.updateUser(
        verification.user_id,
        {
          is_email_verified: true,
        }
      );

      if (!userResponse.success) {
        return ServiceResponse.failure(
          "Error updating user verification status",
          false,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return ServiceResponse.success("Email verified successfully", true);
    } catch (error) {
      logger.error("Error verifying email:", error);
      return ServiceResponse.failure(
        "Error verifying email",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
