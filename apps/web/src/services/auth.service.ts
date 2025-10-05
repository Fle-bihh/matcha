import { RegisterRequestDto, RegisterResponseDto } from "@matcha/shared";
import { BaseService } from "./base.service";
import { API_ROUTES } from "@/constants";
import { ServiceResponse } from "@/types";
import { setAuthUser } from "@/store";
import { EStorageKeys } from "@/types/storage.constants";

export class AuthService extends BaseService {
	private async updateStorageAuthData(
		data: Partial<RegisterResponseDto>
	): Promise<void> {
		if (data.accessToken) {
			await this.storageService.setItem(
				EStorageKeys.AccessToken,
				data.accessToken
			);
		}
		if (data.refreshToken) {
			await this.storageService.setItem(
				EStorageKeys.RefreshToken,
				data.refreshToken
			);
		}
		if (data.user) {
			await this.storageService.setItem(EStorageKeys.User, data.user);
			this.dispatch(setAuthUser(data.user));
		}
	}

	async register(data: RegisterRequestDto): Promise<ServiceResponse<{}>> {
		const response = await this.apiService.post<RegisterResponseDto>(
			API_ROUTES.register,
			data
		);

		if (!response.success) {
			return ServiceResponse.failure(response.message);
		}

		await this.updateStorageAuthData(response.responseObject);

		this.dispatch(setAuthUser(response.responseObject.user));
		return ServiceResponse.success({});
	}
}
