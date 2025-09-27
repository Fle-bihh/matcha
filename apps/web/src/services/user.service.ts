import { ApiResponse, logger, User } from "@matcha/shared";
import { ETokens } from "@/types/container.types";
import type { ApiService } from "./api.service";
import { BaseService } from "./base.service";
import { API_ROUTES } from "@/constants/api.constants";
import { setLoader } from "@/store/slices/loaders.slice";
import { EEntityTypes, EFlagKeys, ELoaderKeys } from "@/types/store.types";
import { setFlag } from "@/store/slices/flags.slice";
import { ServiceResponse } from "@/types/service.types";
import { setEntities } from "@/store/slices/entities.slice";

export class UserService extends BaseService {
	private get apiService(): ApiService {
		return this.container.get<ApiService>(ETokens.ApiService);
	}

	private get dispatch() {
		return this.container.store.dispatch;
	}

	async getUsers(): Promise<ServiceResponse<{}>> {
		this.dispatch(
			setLoader({ key: ELoaderKeys.fetchUsers, loading: true })
		);
		this.dispatch(
			setFlag({ key: EFlagKeys.UsersFetchError, value: false })
		);
		try {
			const response = await this.apiService.get<
				ApiResponse<User[] | null>
			>(API_ROUTES.getAllUsers);
			this.dispatch(
				setEntities({
					entityType: EEntityTypes.Users,
					entities: response.responseObject || [],
				})
			);
			this.dispatch(
				setFlag({ key: EFlagKeys.UsersFetched, value: true })
			);
			return ServiceResponse.success({});
		} catch (error) {
			this.dispatch(
				setFlag({ key: EFlagKeys.UsersFetchError, value: true })
			);
			return ServiceResponse.failure({});
		} finally {
			this.dispatch(
				setLoader({ key: ELoaderKeys.fetchUsers, loading: false })
			);
		}
	}
}
