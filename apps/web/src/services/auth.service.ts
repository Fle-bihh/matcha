import {
	AuthenticateResponseDto,
	getRoute,
	type LoginRequestDto,
	LoginResponseDto,
	type RegisterRequestDto,
	RegisterResponseDto,
	RouteKeys,
} from "@matcha/shared";
import { BaseService } from "./base.service";
import { ServiceResponse } from "@/types";
import { clearAction, setAction, setAuthUser } from "@/store";
import { EStorageKeys } from "@/types/storage.constants";
import { action } from "@/decorators";
import { EActionKeys } from "@/types/actions.types";

type AuthData = Partial<RegisterResponseDto>;

export class AuthService extends BaseService {
	private readonly MESSAGES = {
		NO_AUTH_DATA: "No valid authentication data found",
		AUTH_CHECK_FAILED: "Authentication check failed",
		AUTH_SUCCESSFUL: "User authenticated successfully",
		LOGOUT_SUCCESSFUL: "User logged out successfully",
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
			this.dispatch(setAuthUser(user));
		}
	}

	private async clearAuthData(): Promise<void> {
		await this.storageService.clear();
		this.dispatch(setAuthUser(null));
	}

	private async hasValidAuthData(): Promise<boolean> {
		const [accessToken, refreshToken] = await Promise.all([
			this.storageService.getItem(EStorageKeys.AccessToken),
			this.storageService.getItem(EStorageKeys.RefreshToken),
		]);

		return !!(accessToken && refreshToken);
	}

	private getAuthRoute(route: RouteKeys<"auth">): string {
		return getRoute("auth", route);
	}

	@action()
	public async authenticate() {
		try {
			if (await this.hasValidAuthData()) {
				const authenticateResponse = await this.apiService.post<AuthenticateResponseDto>(
					this.getAuthRoute("authenticate"),
					{
						accessToken: await this.storageService.getItem(
							EStorageKeys.AccessToken
						),
					}
				);

				if (authenticateResponse.success && authenticateResponse.responseObject) {
					this.storeAuthData(authenticateResponse.responseObject);
					return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
				}

				return ServiceResponse.failure(authenticateResponse.message);
			}

			await this.clearAuthData();
			return ServiceResponse.success(this.MESSAGES.NO_AUTH_DATA);
		} catch (error) {
			await this.clearAuthData();
			return ServiceResponse.failure(
				this.MESSAGES.AUTH_CHECK_FAILED
			);
		}
	}

	@action()
	public async login(dto: LoginRequestDto) {
		this.dispatch(clearAction({ key: EActionKeys.Register }))
		const response = await this.apiService.post<LoginResponseDto>(
			this.getAuthRoute("login"),
			dto
		);

		if (!response.success) {
			return ServiceResponse.failure(response.message);
		}

		await this.storeAuthData(response.responseObject);
		return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
	}

	@action()
	public async register(dto: RegisterRequestDto) {
		this.dispatch(clearAction({ key: EActionKeys.Login }))
		const response = await this.apiService.post<RegisterResponseDto>(
			this.getAuthRoute("register"),
			dto
		);

		if (!response.success) {
			console.log("Registration failed:", response);
			return ServiceResponse.failure(response.message);
		}

		await this.storeAuthData(response.responseObject);
		return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
	}

	@action()
	public async logout() {
		await this.clearAuthData();
		return ServiceResponse.success(this.MESSAGES.LOGOUT_SUCCESSFUL);
	}
}
