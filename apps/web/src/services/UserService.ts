import { logger, User } from "@matcha/shared";
import { BaseService } from "./ApiService";
import { ETokens } from "@/types/container";
import type { ApiService } from "./ApiService";

export class UserService extends BaseService {
	private get apiService(): ApiService {
		return this.container.get<ApiService>(ETokens.ApiService);
	}

	async getUsers(): Promise<User[]> {
		logger.info("Fetching users from /user/users endpoint");

		const response = await this.apiService.get<{
			success: boolean;
			message: string;
			responseObject: User[];
			statusCode: number;
		}>("/user/users");

		return response.responseObject || [];
	}

	async getUserById(id: string): Promise<User | null> {
		logger.info(`Fetching user with id ${id}`);

		try {
			const response = await this.apiService.get<{
				success: boolean;
				message: string;
				responseObject: User;
				statusCode: number;
			}>(`/user/users/${id}`);

			return response.responseObject;
		} catch (error) {
			logger.error(`Failed to fetch user with id ${id}`, error);
			return null;
		}
	}
}
