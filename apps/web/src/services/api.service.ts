import { IContainer } from "@/types";
import { BaseService } from "./base.service";
import { ApiResponse, logger, getRoute } from "@matcha/shared";
import { EStorageKeys } from "@/types/storage.constants";
import { config } from "@/config";

interface RequestOptions {
  auth?: boolean;
  formData?: boolean;
  _isRetry?: boolean;
}

export class ApiService extends BaseService {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(container: IContainer) {
    super(container);
    this.baseUrl = config.apiUrl;
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

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders(options);

    let requestBody: BodyInit | undefined;
    if (body) {
      if (options?.formData) {
        // Convert object to FormData
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

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
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

    if (!response.ok) {
      const data = await response.clone().json();
      throw new Error(`${data.message || response.statusText}`);
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, options);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, options);
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, data, options);
  }
}
