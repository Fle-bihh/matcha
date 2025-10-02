import { ApiResponse, User } from "@matcha/shared";
import {
	EEntityTypes,
	EFlaggerKeys,
	ELoaderKeys,
	ETokens,
	ServiceResponse,
} from "@/types";
import { setEntities, setFlagger, setLoader } from "@/store";
import { API_ROUTES } from "@/constants";
import type { ApiService } from "./api.service";
import { BaseService } from "./base.service";
import { parseErrorMessage } from "@/utils/error.utils";
import { createTimestampString } from "@/utils/date.utils";

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
			setFlagger({
				key: EFlaggerKeys.UsersFetched,
				value: { isFetched: false },
			})
		);
		try {
			const response = await this.apiService.get<User[] | null>(
				API_ROUTES.getAllUsers
			);
			this.dispatch(
				setEntities({
					entityType: EEntityTypes.Users,
					entities: response.responseObject || [],
				})
			);
			this.dispatch(
				setFlagger({
					key: EFlaggerKeys.UsersFetched,
					value: { isFetched: true },
				})
			);
			return ServiceResponse.success({});
		} catch (error) {
			this.dispatch(
				setFlagger({
					key: EFlaggerKeys.UsersFetched,
					value: {
						isFetched: false,
						error: {
							message: parseErrorMessage(error),
							timestamp: createTimestampString(),
						},
					},
				})
			);
			return ServiceResponse.failure({});
		} finally {
			this.dispatch(
				setLoader({ key: ELoaderKeys.fetchUsers, loading: false })
			);
		}
	}
}
