import { ApiResponse, User } from "@matcha/shared";
import { EEntityTypes, ETokens, ServiceResponse } from "@/types";
import { setEntities, setFlagger, setLoader } from "@/store";
import { API_ROUTES } from "@/constants";
import type { ApiService } from "./api.service";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
	private get apiService(): ApiService {
		return this.container.get<ApiService>(ETokens.ApiService);
	}

	private get dispatch() {
		return this.container.store.dispatch;
	}

	async getUsers(): Promise<ServiceResponse<{}>> {
		const response = await this.apiService.get<User[] | null>(
			API_ROUTES.getAllUsers
		);
		this.dispatch(
			setEntities({
				entityType: EEntityTypes.Users,
				entities: response.responseObject || [],
			})
		);
		return ServiceResponse.success({});
	}
}
