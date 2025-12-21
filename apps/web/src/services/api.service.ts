import { IContainer } from "@/types";
import { BaseService } from "./base.service";
import { API_BASE_URL } from "@/constants";
import { ApiResponse, logger, getRoute } from "@matcha/shared";
import { EStorageKeys } from "@/types/storage.constants";

interface RequestOptions {
  auth?: boolean;
  _isRetry?: boolean;
}

export class ApiService extends BaseService {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(container: IContainer) {
    super(container);
    this.baseUrl = API_BASE_URL;
  }

  private async getAuthHeaders(options?: RequestOptions): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

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
          await this.storageService.clear();
          return false;
        }

        const data = await response.json();

        if (data.success && data.responseObject) {
          await this.storageService.setItem(
            EStorageKeys.AccessToken,
            data.responseObject.accessToken
          );
          await this.storageService.setItem(
            EStorageKeys.RefreshToken,
            data.responseObject.refreshToken
          );
          return true;
        }

        return false;
      } catch (error) {
        logger.error("Error refreshing token:", error);
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders(options);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (response.status === 401 && options?.auth && !options._isRetry) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.get<T>(endpoint, { ...options, _isRetry: true });
      }
    }

    if (!response.ok) {
      const data = await response.clone().json();
      throw new Error(`${data.message || response.statusText}`);
    }

    return response.json();
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders(options);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401 && options?.auth && !options._isRetry) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.post<T>(endpoint, data, { ...options, _isRetry: true });
      }
    }

    if (!response.ok) {
      const data = await response.clone().json();
      throw new Error(`${data.message || response.statusText}`);
    }

    return response.json();
  }
}
