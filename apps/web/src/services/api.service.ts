import { ETokens, IContainer } from "@/types";
import { BaseService } from "./base.service";
import {
  ApiResponse,
  logger,
  getRoute,
  RefreshTokenResponseDto,
} from "@matcha/shared";
import { EStorageKeys } from "@/types/storage.constants";
import { config } from "@/config";
import { ApiRequestResponse } from "@/types/api.types";
import { AuthService } from "./auth.service";

interface RequestOptions {
  auth?: boolean;
  formData?: boolean;
  _isRetry?: boolean;
  params?: Record<string, any>;
}

export class ApiService extends BaseService {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(container: IContainer) {
    super(container);
    this.baseUrl = config.apiUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    if (!params) {
      return endpoint;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }

  private async getAuthHeaders(options?: RequestOptions): Promise<HeadersInit> {
    const headers: HeadersInit = {};

    if (!options?.formData) {
      headers["Content-Type"] = "application/json";
    }

    if (options?.auth) {
      const accessToken = await this.storageService.getItem(
        EStorageKeys.AccessToken
      );
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return headers;
  }

  private async handleAuthFailure(): Promise<void> {
    await this.storageService.clear();
    const authService = this.container.get<AuthService>(ETokens.AuthService);
    await authService.logout();
    this.snackbar.warning("Your session has expired. Please log in again.");
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = await this.storageService.getItem(
          EStorageKeys.RefreshToken
        );

        if (!refreshToken) {
          await this.handleAuthFailure();
          return false;
        }

        const response = await fetch(
          `${this.baseUrl}${getRoute("auth", "refresh")}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!response.ok) {
          await this.handleAuthFailure();
          return false;
        }

        const responseContent: ApiResponse<RefreshTokenResponseDto> =
          await response.json();
        const wholeResponse: ApiRequestResponse<RefreshTokenResponseDto> = {
          ...responseContent,
          status: response.status || 200,
        };

        if (this.isSuccess(wholeResponse)) {
          await this.storageService.setItem(
            EStorageKeys.AccessToken,
            responseContent.data.accessToken
          );
          await this.storageService.setItem(
            EStorageKeys.RefreshToken,
            responseContent.data.refreshToken
          );
          return true;
        }

        await this.handleAuthFailure();
        return false;
      } catch (error) {
        logger.error("Error refreshing token:", error);
        await this.handleAuthFailure();
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiRequestResponse<T>> {
    const headers = await this.getAuthHeaders(options);
    const url = this.buildUrl(endpoint, options?.params);

    let requestBody: BodyInit | undefined;
    if (body) {
      if (options?.formData) {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        requestBody = formData;
      } else {
        requestBody = JSON.stringify(body);
      }
    }

    const response: Response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: requestBody,
    });

    if (response.status === 401 && options?.auth && !options._isRetry) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.request<T>(method, endpoint, body, {
          ...options,
          _isRetry: true,
        });
      }
    }

    return { ...(await response.json()), status: response.status };
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiRequestResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiRequestResponse<T>> {
    return this.request<T>("POST", endpoint, data, options);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiRequestResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, options);
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiRequestResponse<T>> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiRequestResponse<T>> {
    return this.request<T>("PUT", endpoint, data, options);
  }
}
