import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { EmailVerificationRepository } from "@/repositories/email-verification.repository";
import { UserService } from "./user.service";
import { logger } from "@matcha/shared";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

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
