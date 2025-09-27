import { ApiResponse, logger, User } from "@matcha/shared";
import { ETokens } from "@/types/container.types";
import type { ApiService } from "./api.service";
import { BaseService } from "./base.service";
import { API_ROUTES } from "@/constants/api.constants";

export class UserService extends BaseService {
	private get apiService(): ApiService {
		return this.container.get<ApiService>(ETokens.ApiService);
	}

	async getUsers(): Promise<User[]> {
		const response = await this.apiService.get<ApiResponse<User[] | null>>(
			API_ROUTES.getAllUsers
		);

		return response.responseObject || [];
	}
}
