import {
  AuthenticateResponseDto,
  getRoute,
  type LoginRequestDto,
  LoginResponseDto,
  type RegisterRequestDto,
  RegisterResponseDto,
  RouteKeys,
  type VerifyEmailRequestDto,
  VerifyEmailResponseDto,
  ResendVerificationEmailResponseDto,
  type ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  type ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from "@matcha/shared";
import { BaseService } from "./base.service";
import { ServiceResponse } from "@/types";
import { clearAction, setAuthUser, setEmailToVerified } from "@/store";
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
    EMAIL_VERIFIED: "Email verified successfully",
    EMAIL_VERIFICATION_SENT: "Verification email sent successfully",
    PASSWORD_RESET_SENT: "Password reset link sent successfully",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",
  } as const;

  private async storeAuthData(data: AuthData): Promise<void> {
    const { accessToken, refreshToken, user } = data;

    if (accessToken) {
      await this.storageService.setItem(EStorageKeys.AccessToken, accessToken);
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
        // Make a 1 second delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 500));
        const authenticateResponse =
          await this.apiService.get<AuthenticateResponseDto>(
            this.getAuthRoute("authenticate"),
            { auth: true }
          );

        if (
          authenticateResponse.success &&
          authenticateResponse.responseObject
        ) {
          this.storeAuthData(authenticateResponse.responseObject);
          return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
        }

        return ServiceResponse.failure(authenticateResponse.message);
      }

      await this.clearAuthData();
      return ServiceResponse.success(this.MESSAGES.NO_AUTH_DATA);
    } catch (error) {
      await this.clearAuthData();
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

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    await this.storeAuthData(response.responseObject);
    return ServiceResponse.success(this.MESSAGES.AUTH_SUCCESSFUL);
  }

  @action({ showSuccessMessage: true })
  public async register(dto: RegisterRequestDto) {
    this.dispatch(clearAction({ key: EActionKeys.Login }));
    const response = await this.apiService.post<RegisterResponseDto>(
      this.getAuthRoute("register"),
      dto
    );

    if (!response.success) {
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

  @action({ showSuccessMessage: true })
  public async verifyEmail(dto: VerifyEmailRequestDto) {
    const response = await this.apiService.post<VerifyEmailResponseDto>(
      this.getAuthRoute("verify-email"),
      dto
    );

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    this.dispatch(setEmailToVerified());
    this.router.replace("/login");
    return ServiceResponse.success(this.MESSAGES.EMAIL_VERIFIED);
  }

  @action({ showSuccessMessage: true, showErrorMessage: true })
  public async resendVerificationEmail() {
    const response =
      await this.apiService.get<ResendVerificationEmailResponseDto>(
        this.getAuthRoute("resend-verification-email"),
        { auth: true }
      );

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    return ServiceResponse.success(this.MESSAGES.EMAIL_VERIFICATION_SENT);
  }

  @action({ showErrorMessage: true })
  public async forgotPassword(dto: ForgotPasswordRequestDto) {
    const response = await this.apiService.post<ForgotPasswordResponseDto>(
      this.getAuthRoute("forgot-password"),
      dto
    );

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    return ServiceResponse.success(this.MESSAGES.PASSWORD_RESET_SENT);
  }

  @action({ showSuccessMessage: true, showErrorMessage: true })
  public async resetPassword(dto: ResetPasswordRequestDto) {
    const response = await this.apiService.post<ResetPasswordResponseDto>(
      this.getAuthRoute("reset-password"),
      dto
    );

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    this.router.replace("/login");
    return ServiceResponse.success(this.MESSAGES.PASSWORD_RESET_SUCCESS);
  }
}
