import {
	logger,
	LoginRequestDto,
	LoginResponseDto,
	RegisterRequestDto,
	RegisterResponseDto,
} from "@matcha/shared";
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

	public async authenticate(): Promise<ServiceResponse<{}>> {
		try {
			const accessToken = await this.storageService.getItem(
				EStorageKeys.AccessToken
			);
			const refreshToken = await this.storageService.getItem(
				EStorageKeys.RefreshToken
			);

			const user = await this.storageService.getItem(EStorageKeys.User);

			if (accessToken && refreshToken && user) {
				this.dispatch(setAuthUser(user));
				return ServiceResponse.success({});
			}

			await this.storageService.clear();
			this.dispatch(setAuthUser(null));
			return ServiceResponse.success(
				"No valid authentication data found"
			);
		} catch (error) {
			this.dispatch(setAuthUser(null));
			return ServiceResponse.failure("Authentication check failed");
		}
	}

	public async login(dto: LoginRequestDto): Promise<ServiceResponse<{}>> {
		const response = await this.apiService.post<LoginResponseDto>(
			API_ROUTES.login,
			dto
		);
		if (!response.success) {
			return ServiceResponse.failure(response.message);
		}

		await this.updateStorageAuthData(response.responseObject);
		this.dispatch(setAuthUser(response.responseObject.user));
		return ServiceResponse.success({});
	}

	public async register(
		data: RegisterRequestDto
	): Promise<ServiceResponse<{}>> {
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

	public async logout(): Promise<ServiceResponse<{}>> {
		try {
			await this.storageService.clear();
			this.dispatch(setAuthUser(null));
			return ServiceResponse.success({});
		} catch (error) {
			logger.error("Error during logout", error);
			return ServiceResponse.failure("Error during logout");
		}
	}
}
