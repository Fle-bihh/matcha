import {
	AuthenticateResponseDto,
	getRoute,
	type LoginRequestDto,
	LoginResponseDto,
	type RegisterRequestDto,
	RegisterResponseDto,
	RouteKeys,
	type VerifyEmailRequestDto,
	type ForgotPasswordRequestDto,
	type ResetPasswordRequestDto,
	type SendChangeEmailVerificationRequestDto,
	type ChangeEmailRequestDto,
	ChangeEmailResponseDto,
} from "@matcha/shared";
import { BaseService } from "./base.service";
import { CrossTabEvent, ETokens, ServiceResponse } from "@/types";
import {
	changeEmail,
	clearAction,
	clearEntities,
	resetPagers,
	setAuthUser,
	setEmailToVerified,
} from "@/store";
import { EStorageKeys } from "@/types/storage.constants";
import { action } from "@/decorators";
import { EActionKeys } from "@/types/actions.types";
import { crossTab } from "@/utils/cross-tab.utils";
import { EFlaggers } from "@/constants/flaggers.constants";
import { BrowsingService } from "./browsing.service";
import { WebSocketService } from "./websocket.service";

type AuthData = Partial<RegisterResponseDto>;

export class AuthService extends BaseService {
	private readonly MESSAGES = {
		NO_AUTH_DATA: "No valid authentication data found",
		AUTH_CHECK_FAILED: "Authentication check failed",
		AUTH_SUCCESSFUL: "User authenticated successfully",
		LOGOUT_SUCCESSFUL: "User logged out successfully",
		EMAIL_VERIFIED: "Email verified successfully",
		EMAIL_VERIFICATION_SENT: "Verification email sent successfully",
		PASSWORD_RESET_SENT: "Password reset link sent successfully",
		PASSWORD_RESET_SUCCESS: "Password reset successfully",
		EMAIL_CHANGE_VERIFICATION_SENT:
			"Verification link sent to your new email",
		EMAIL_CHANGED: "Email changed successfully",
	} as const;

	private get browsingService(): BrowsingService {
		return this.container.get<BrowsingService>(ETokens.BrowsingService);
	}

	private get webSocketService(): WebSocketService {
		return this.container.get<WebSocketService>(ETokens.WebSocketService);
	}

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
			if (user.is_profile_complete) {
				this.browsingService.loadBrowsingFilters();
			}
		}
	}

	private async clearAuthData(): Promise<void> {
		await this.storageService.clear();
		this.dispatch(setAuthUser(null));
		this.dispatch(clearEntities());
		this.dispatch(resetPagers());
		this.webSocketService.disconnect();
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
				// Make a 1 second delay to show loading state
				await new Promise((resolve) => setTimeout(resolve, 500));
				const authenticateResponse =
					await this.apiService.get<AuthenticateResponseDto>(
						this.getAuthRoute("authenticate"),
						{ auth: true }
					);

				if (this.isSuccess(authenticateResponse)) {
					await this.storeAuthData(authenticateResponse.data);
					await this.webSocketService.connect();
					return ServiceResponse.success(
						this.MESSAGES.AUTH_SUCCESSFUL
					);
				}

				return ServiceResponse.failure(authenticateResponse.message);
			}

			this.clearAuthData();
			return ServiceResponse.success(this.MESSAGES.NO_AUTH_DATA);
		} catch (error) {
			this.clearAuthData();
			return ServiceResponse.failure(this.MESSAGES.AUTH_CHECK_FAILED);
		}
	}

	@action({ showSuccessMessage: true })
	public async login(dto: LoginRequestDto) {
		this.dispatch(clearAction({ key: EActionKeys.Register }));
		const response = await this.apiService.post<LoginResponseDto>(
			this.getAuthRoute("login"),
			dto
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		await this.storeAuthData(response.data);
		return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
	}

	@action({ showSuccessMessage: true })
	public async register(dto: RegisterRequestDto) {
		this.dispatch(clearAction({ key: EActionKeys.Login }));
		const response = await this.apiService.post<RegisterResponseDto>(
			this.getAuthRoute("register"),
			dto
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		await this.storeAuthData(response.data);
		return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
	}

	@action()
	public async logout() {
		await this.clearAuthData();
		return ServiceResponse.success(this.MESSAGES.LOGOUT_SUCCESSFUL);
	}

	@action({ showSuccessMessage: true })
	public async verifyEmail(dto: VerifyEmailRequestDto) {
		const response = await this.apiService.post<null>(
			this.getAuthRoute("verify-email"),
			dto
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		this.dispatch(setEmailToVerified());

		crossTab.broadcast(CrossTabEvent.EmailVerified);

		return ServiceResponse.success(this.MESSAGES.EMAIL_VERIFIED);
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	public async resendVerificationEmail() {
		const response = await this.apiService.get<null>(
			this.getAuthRoute("resend-verification-email"),
			{ auth: true }
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		return ServiceResponse.success(this.MESSAGES.EMAIL_VERIFICATION_SENT);
	}

	@action({ showErrorMessage: true, showSuccessMessage: true })
	public async forgotPassword(dto: ForgotPasswordRequestDto) {
		const response = await this.apiService.post<null>(
			this.getAuthRoute("forgot-password"),
			dto
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		return ServiceResponse.success(this.MESSAGES.PASSWORD_RESET_SENT);
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	public async resetPassword(dto: ResetPasswordRequestDto) {
		const response = await this.apiService.post<null>(
			this.getAuthRoute("reset-password"),
			dto
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		this.router.replace("/login");
		return ServiceResponse.success(this.MESSAGES.PASSWORD_RESET_SUCCESS);
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	public async sendChangeEmailVerification(
		dto: SendChangeEmailVerificationRequestDto
	) {
		const response = await this.apiService.post<null>(
			this.getAuthRoute("send-change-email-verification"),
			dto,
			{ auth: true }
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		this.setFlagger({
			key: EFlaggers.ChangeEmailDialog,
			value: { isOpen: false },
		});

		return ServiceResponse.success(
			this.MESSAGES.EMAIL_CHANGE_VERIFICATION_SENT
		);
	}

	@action({ showSuccessMessage: true })
	public async changeEmail(dto: ChangeEmailRequestDto) {
		const response = await this.apiService.post<ChangeEmailResponseDto>(
			this.getAuthRoute("change-email"),
			dto,
			{ auth: true }
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		this.dispatch(changeEmail(response.data.newEmail));

		crossTab.broadcast(CrossTabEvent.EmailChanged, response.data.newEmail);

		return ServiceResponse.success(this.MESSAGES.EMAIL_CHANGED);
	}
}
