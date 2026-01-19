import { ETokens, IContainer } from "@/types";
import { BaseService } from "./base.service";
import {
	ApiResponse,
	logger,
	getRoute,
	RefreshTokenResponseDto,
	ERouteGroups,
} from "@matcha/shared";
import { EStorageKeys } from "@/types";
import { config } from "@/config";
import { ApiRequestResponse } from "@/types";
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

	private async fetch<T>(
		url: string,
		options: RequestInit,
	): Promise<ApiRequestResponse<T>> {
		// logger.debug("Request started:", { method: options.method, url });
		const response: Response = await fetch(url, options);

		const status = response.status || 200;
		const contentLength = response.headers.get("Content-Length");
		const contentType = response.headers.get("Content-Type");

		let data: any = null;

		if (
			contentLength !== "0" &&
			contentType?.includes("application/json")
		) {
			const text = await response.text();
			if (text && text.length > 0) {
				try {
					data = JSON.parse(text);
				} catch (error) {
					logger.error("Failed to parse JSON response:", error);
					data = null;
				}
			}
		}

		// logger.debug("Request completed:", {
		// 	status,
		// 	method: options.method,
		// 	url,
		// 	data,
		// });
		return { ...data, status };
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

	private async getAuthHeaders(
		options?: RequestOptions,
	): Promise<HeadersInit> {
		const headers: HeadersInit = {};

		if (!options?.formData) {
			headers["Content-Type"] = "application/json";
		}

		if (options?.auth) {
			const accessToken = await this.storageService.getItem(
				EStorageKeys.AccessToken,
			);
			if (accessToken) {
				headers["Authorization"] = `Bearer ${accessToken}`;
			}
		}

		return headers;
	}

	private async handleAuthFailure(): Promise<void> {
		await this.storageService.clear();
		const authService = this.container.get<AuthService>(
			ETokens.AuthService,
		);
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
					EStorageKeys.RefreshToken,
				);

				if (!refreshToken) {
					await this.handleAuthFailure();
					return false;
				}

				const response = await this.fetch<RefreshTokenResponseDto>(
					`${this.baseUrl}${getRoute(ERouteGroups.Auth, "refresh")}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ refreshToken }),
					},
				);

				if (response.status >= 400) {
					await this.handleAuthFailure();
					return false;
				}

				if (this.isSuccess(response)) {
					await this.storageService.setItem(
						EStorageKeys.AccessToken,
						response.data.accessToken,
					);
					await this.storageService.setItem(
						EStorageKeys.RefreshToken,
						response.data.refreshToken,
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
		options?: RequestOptions,
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

		const response = await this.fetch<T>(`${this.baseUrl}${url}`, {
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

		return response;
	}

	async get<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiRequestResponse<T>> {
		return this.request<T>("GET", endpoint, undefined, options);
	}

	async post<T>(
		endpoint: string,
		data?: any,
		options?: RequestOptions,
	): Promise<ApiRequestResponse<T>> {
		return this.request<T>("POST", endpoint, data, options);
	}

	async patch<T>(
		endpoint: string,
		data?: any,
		options?: RequestOptions,
	): Promise<ApiRequestResponse<T>> {
		return this.request<T>("PATCH", endpoint, data, options);
	}

	async delete<T>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<ApiRequestResponse<T>> {
		return this.request<T>("DELETE", endpoint, undefined, options);
	}

	async put<T>(
		endpoint: string,
		data?: any,
		options?: RequestOptions,
	): Promise<ApiRequestResponse<T>> {
		return this.request<T>("PUT", endpoint, data, options);
	}
}
