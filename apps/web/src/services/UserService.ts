import { logger, User } from "@matcha/shared";
import { ETokens } from "@/types/container";
import type { ApiService } from "./ApiService";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
	private get apiService(): ApiService {
		return this.container.get<ApiService>(ETokens.ApiService);
	}

	async getUsers(): Promise<User[]> {
		const response = await this.apiService.get<{
			success: boolean;
			message: string;
			responseObject: User[];
			statusCode: number;
		}>("/user/users");

		return response.responseObject || [];
	}
}
