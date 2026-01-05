import { IContainer, ETokens } from "@/types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories";
import { logger } from "@matcha/shared";

export class UserDeletionService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	public async deleteUserAndRelatedData(userId: number): Promise<boolean> {
		try {
			logger.info(`Starting soft-delete for user ${userId}`);

			const user = await this.userRepository.findUserById(userId);
			if (!user) {
				logger.warn(`User ${userId} not found for deletion`);
				return false;
			}

			const deletionSteps = [
				{
					name: "user",
					fn: () => this.userRepository.deleteUser(userId),
				},
			];

			for (const step of deletionSteps) {
				const success = await step.fn();
				if (!success) {
					logger.error(
						`Failed to delete ${step.name} for user ${userId}`
					);
					return false;
				}
				logger.debug(
					`Successfully deleted ${step.name} for user ${userId}`
				);
			}

			logger.info(
				`Successfully completed soft-delete for user ${userId}`
			);
			return true;
		} catch (error) {
			logger.error(
				`Error during user deletion for user ${userId}:`,
				error
			);
			return false;
		}
	}

	public async restoreUserAndRelatedData(userId: number): Promise<boolean> {
		try {
			logger.info(`Starting restore for user ${userId}`);

			const restorationSteps = [
				{
					name: "user",
					fn: () => this.userRepository.restoreUser(userId),
				},
			];

			for (const step of restorationSteps) {
				const success = await step.fn();
				if (!success) {
					logger.error(
						`Failed to restore ${step.name} for user ${userId}`
					);
					return false;
				}
				logger.debug(
					`Successfully restored ${step.name} for user ${userId}`
				);
			}

			logger.info(`Successfully completed restore for user ${userId}`);
			return true;
		} catch (error) {
			logger.error(
				`Error during user restoration for user ${userId}:`,
				error
			);
			return false;
		}
	}
}
