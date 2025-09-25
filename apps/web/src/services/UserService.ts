import { logger, User } from "@matcha/shared";
import { BaseService } from "./ApiService";
import { ETokens } from "../types/container";
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
}
