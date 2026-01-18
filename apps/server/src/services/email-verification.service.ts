import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { EmailVerificationRepository } from "@/repositories";
import { UserService } from "./user.service";
import { ChangeEmailResponseDto, StatusCodes, logger } from "@matcha/shared";
import crypto from "crypto";
import { config } from "@/config";

export class EmailVerificationService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get emailVerificationRepository(): EmailVerificationRepository {
		return this.container.get<EmailVerificationRepository>(
			ETokens.EmailVerificationRepository,
		);
	}

	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}

	public async createVerificationToken(
		userId: number,
	): Promise<ServiceResponse<string | null>> {
		try {
			const token = crypto.randomBytes(32).toString("hex");

			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 24);

			await this.emailVerificationRepository.deleteByUserId(userId);

			await this.emailVerificationRepository.createVerification(
				userId,
				token,
				expiresAt,
			);

			return ServiceResponse.success(
				"Verification token created successfully",
				token,
			);
		} catch (error) {
			logger.error("Error creating verification token:", error);
			return ServiceResponse.failure(
				"Error creating verification token",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async sendVerificationEmail(
		userId: number,
	): Promise<ServiceResponse<null>> {
		try {
			const userResponse = await this.userService.findById(userId);

			if (!this.isSuccess(userResponse) || !userResponse.data) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND,
				);
			}

			const user = userResponse.data;

			const latestVerification =
				await this.emailVerificationRepository.getLatestByUserId(
					userId,
				);

			if (latestVerification) {
				const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
				const lastEmailDate = new Date(latestVerification.created_at);

				if (lastEmailDate > fiveMinutesAgo) {
					const timeRemaining = Math.ceil(
						(lastEmailDate.getTime() + 5 * 60 * 1000 - Date.now()) /
							1000 /
							60,
					);
					return ServiceResponse.failure(
						`Please wait ${timeRemaining} minute(s) before requesting another verification email.`,
						null,
						StatusCodes.TOO_MANY_REQUESTS,
					);
				}
			}

			await this.emailVerificationRepository.deleteByUserId(userId);

			const tokenResponse = await this.createVerificationToken(userId);

			if (!this.isSuccess(tokenResponse)) {
				return ServiceResponse.failure(
					"Error creating verification token",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const verificationLink = `${config.webUrl}/confirm-email?token=${tokenResponse.data}`;

			await this.mailService.sendEmail({
				to: user.email,
				subject: "Verify Your Email - Matcha",
				text: `Hello ${user.username},\n\nThank you for registering! Please verify your email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nMatcha Team`,
			});

			return ServiceResponse.success(
				"Verification email sent successfully",
				null,
			);
		} catch (error) {
			logger.error("Error sending verification email:", error);
			return ServiceResponse.failure(
				"Error sending verification email",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async verifyEmail(token: string): Promise<ServiceResponse<null>> {
		try {
			const verification =
				await this.emailVerificationRepository.findByToken(token);

			if (!verification) {
				return ServiceResponse.failure(
					"Invalid or expired verification token",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const marked = await this.emailVerificationRepository.markAsUsed(
				verification.id,
			);

			if (!marked) {
				return ServiceResponse.failure(
					"Error marking verification as used",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const userResponse = await this.userService.updateUser(
				verification.user_id,
				{
					is_email_verified: true,
				},
			);

			if (!this.isSuccess(userResponse)) {
				return ServiceResponse.failure(
					"Error updating user verification status",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success("Email verified successfully", null);
		} catch (error) {
			logger.error("Error verifying email:", error);
			return ServiceResponse.failure(
				"Error verifying email",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async sendChangeEmailVerification(
		userId: number,
		newEmail: string,
	): Promise<ServiceResponse<null>> {
		try {
			const userResponse = await this.userService.findById(userId);

			if (!this.isSuccess(userResponse) || !userResponse.data) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND,
				);
			}

			const user = userResponse.data;

			const token = crypto.randomBytes(32).toString("hex");

			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 24);

			await this.emailVerificationRepository.deleteByUserId(userId);

			await this.emailVerificationRepository.createVerificationForEmailChange(
				userId,
				newEmail,
				token,
				expiresAt,
			);

			const verificationLink = `${config.webUrl}/confirm-email-change?token=${token}`;

			await this.mailService.sendEmail({
				to: newEmail,
				subject: "Verify Your New Email Address - Matcha",
				text: `Hello ${user.username},\n\nYou requested to change your email address. Please verify your new email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nIf you did not request this change, please contact our support team immediately.\n\nBest regards,\nMatcha Team`,
			});

			return ServiceResponse.success(
				"Change email verification sent successfully",
				null,
			);
		} catch (error) {
			logger.error("Error sending change email verification:", error);
			return ServiceResponse.failure(
				"Error sending change email verification",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async verifyEmailChange(
		token: string,
	): Promise<ServiceResponse<ChangeEmailResponseDto | null>> {
		try {
			const verification =
				await this.emailVerificationRepository.findByToken(token);

			if (
				!verification ||
				!verification.is_new_email ||
				!verification.new_email
			) {
				return ServiceResponse.failure(
					"Invalid or expired verification token",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const marked = await this.emailVerificationRepository.markAsUsed(
				verification.id,
			);

			if (!marked) {
				return ServiceResponse.failure(
					"Error marking verification as used",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const userResponse = await this.userService.updateUser(
				verification.user_id,
				{
					email: verification.new_email,
					is_email_verified: true,
				},
			);

			if (!this.isSuccess(userResponse)) {
				return ServiceResponse.failure(
					"Error updating user email",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success("Email changed successfully", {
				new_email: verification.new_email,
			});
		} catch (error) {
			logger.error("Error verifying email change:", error);
			return ServiceResponse.failure(
				"Error verifying email change",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
