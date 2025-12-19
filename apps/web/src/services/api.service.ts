import { IContainer } from "@/types";
import { BaseService } from "./base.service";
import { API_BASE_URL } from "@/constants";
import { ApiResponse, logger } from "@matcha/shared";
import { EStorageKeys } from "@/types/storage.constants";

interface RequestOptions {
  auth?: boolean;
}

export class ApiService extends BaseService {
  private baseUrl: string;

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

  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders(options);
    const response = (await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    })) as Response & ApiResponse<T>;

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.name = "HTTPError";
      throw error;
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

    if (!response.ok) {
      const data = await response.clone().json();
      throw new Error(`${data.message || response.statusText}`);
    }

    return response.json();
  }
}
