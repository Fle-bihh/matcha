import {
	type LoginRequestDto,
	LoginResponseDto,
	type RegisterRequestDto,
	RegisterResponseDto,
} from "@matcha/shared";
import { BaseService } from "./base.service";
import { API_ROUTES } from "@/constants";
import { ServiceResponse } from "@/types";
import { setAuthUser } from "@/store";
import { EStorageKeys } from "@/types/storage.constants";
import { action } from "@/decorators";

type AuthData = Partial<RegisterResponseDto>;

export class AuthService extends BaseService {
	private static readonly MESSAGES = {
		NO_AUTH_DATA: "No valid authentication data found",
		AUTH_CHECK_FAILED: "Authentication check failed",
	} as const;

	private async storeAuthData(data: AuthData): Promise<void> {
		const { accessToken, refreshToken, user } = data;

		if (accessToken) {
			await this.storageService.setItem(
				EStorageKeys.AccessToken,
				accessToken
			);
		}

		if (refreshToken) {
			await this.storageService.setItem(
				EStorageKeys.RefreshToken,
				refreshToken
			);
		}

		if (user) {
			await this.storageService.setItem(EStorageKeys.User, user);
			this.dispatch(setAuthUser(user));
		}
	}

	private async clearAuthData(): Promise<void> {
		await this.storageService.clear();
		this.dispatch(setAuthUser(null));
	}

	private async hasValidAuthData(): Promise<boolean> {
		const [accessToken, refreshToken, user] = await Promise.all([
			this.storageService.getItem(EStorageKeys.AccessToken),
			this.storageService.getItem(EStorageKeys.RefreshToken),
			this.storageService.getItem(EStorageKeys.User),
		]);

		return !!(accessToken && refreshToken && user);
	}

	@action()
	public async authenticate() {
		try {
			if (await this.hasValidAuthData()) {
				const user = await this.storageService.getItem(
					EStorageKeys.User
				);
				this.dispatch(setAuthUser(user));
				return ServiceResponse.success("User authenticated");
			}

			await this.clearAuthData();
			return ServiceResponse.failure(AuthService.MESSAGES.NO_AUTH_DATA);
		} catch (error) {
			await this.clearAuthData();
			return ServiceResponse.failure(
				AuthService.MESSAGES.AUTH_CHECK_FAILED
			);
		}
	}

	@action()
	public async login(dto: LoginRequestDto) {
		const response = await this.apiService.post<LoginResponseDto>(
			API_ROUTES.login,
			dto
		);

		if (!response.success) {
			return ServiceResponse.failure(response.message);
		}

		await this.storeAuthData(response.responseObject);
		return ServiceResponse.success("User logged in");
	}

	@action()
	public async register(dto: RegisterRequestDto) {
		const response = await this.apiService.post<RegisterResponseDto>(
			API_ROUTES.register,
			dto
		);

		if (!response.success) {
			return ServiceResponse.failure(response.message);
		}

		await this.storeAuthData(response.responseObject);
		return ServiceResponse.success("User registered");
	}

	@action()
	public async logout() {
		await this.clearAuthData();
		return ServiceResponse.success("User logged out");
	}
}
