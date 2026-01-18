import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { PasswordResetRepository } from "@/repositories";
import { UserService } from "./user.service";
import { StatusCodes, logger } from "@matcha/shared";
import crypto from "crypto";
import { config } from "@/config";

export class PasswordResetService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	public async createResetToken(
		userId: number,
	): Promise<ServiceResponse<string | null>> {
		try {
			const token = crypto.randomBytes(32).toString("hex");

			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 1);

			await this.passwordResetRepository.deleteByUserId(userId);

			await this.passwordResetRepository.createPasswordReset(
				userId,
				token,
				expiresAt,
			);

			return ServiceResponse.success(
				"Password reset token created successfully",
				token,
			);
		} catch (error) {
			logger.error("Error creating password reset token:", error);
			return ServiceResponse.failure(
				"Error creating password reset token",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async sendPasswordResetEmail(
		email: string,
	): Promise<ServiceResponse<null>> {
		try {
			const userResponse = await this.userService.findByEmail(email);

			if (!this.isSuccess(userResponse) || !userResponse.data) {
				return ServiceResponse.success(
					"If the email exists, a password reset link has been sent",
					null,
				);
			}

			const user = userResponse.data;

			const latestReset =
				await this.passwordResetRepository.findLatestByUserId(user.id);

			if (latestReset) {
				const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
				const lastEmailDate = new Date(latestReset.created_at);

				if (lastEmailDate > fiveMinutesAgo) {
					const timeRemaining = Math.ceil(
						(lastEmailDate.getTime() + 5 * 60 * 1000 - Date.now()) /
							1000 /
							60,
					);
					return ServiceResponse.failure(
						`Please wait ${timeRemaining} minute(s) before requesting another password reset email.`,
						null,
						StatusCodes.TOO_MANY_REQUESTS,
					);
				}
			}

			await this.passwordResetRepository.deleteByUserId(user.id);

			const tokenResponse = await this.createResetToken(user.id);

			if (!this.isSuccess(tokenResponse) || !tokenResponse.data) {
				return ServiceResponse.failure(
					"Error creating password reset token",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const resetLink = `${config.webUrl}/modify-password?token=${tokenResponse.data}`;

			await this.mailService.sendEmail({
				to: user.email,
				subject: "Reset Your Password - Matcha",
				text: `Hello ${user.username},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nMatcha Team`,
			});

			return ServiceResponse.success(
				"If the email exists, a password reset link has been sent",
				null,
			);
		} catch (error) {
			logger.error("Error sending password reset email:", error);
			return ServiceResponse.failure(
				"Error sending password reset email",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async verifyResetToken(
		token: string,
	): Promise<ServiceResponse<number | null>> {
		try {
			const reset = await this.passwordResetRepository.findByToken(token);

			if (!reset) {
				return ServiceResponse.failure(
					"Invalid or expired password reset token",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			return ServiceResponse.success(
				"Password reset token is valid",
				reset.user_id,
			);
		} catch (error) {
			logger.error("Error verifying reset token:", error);
			return ServiceResponse.failure(
				"Error verifying reset token",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async resetPassword(
		token: string,
		newPassword: string,
	): Promise<ServiceResponse<null>> {
		try {
			const reset = await this.passwordResetRepository.findByToken(token);

			if (!reset) {
				return ServiceResponse.failure(
					"Invalid or expired password reset token",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const userResponse = await this.userService.updateUserPassword(
				reset.user_id,
				newPassword,
			);

			if (!this.isSuccess(userResponse)) {
				return ServiceResponse.failure(
					userResponse.message,
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const marked = await this.passwordResetRepository.markAsUsed(
				reset.id,
			);

			if (!marked) {
				return ServiceResponse.failure(
					"Error marking reset token as used",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			await this.passwordResetRepository.deleteByUserId(reset.user_id);

			return ServiceResponse.success("Password reset successfully", null);
		} catch (error) {
			logger.error("Error resetting password:", error);
			return ServiceResponse.failure(
				"Error resetting password",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
