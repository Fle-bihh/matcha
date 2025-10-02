import { IContainer } from "@/types";
import { BaseService } from "./base.service";
import { API_BASE_URL } from "@/constants";
import { ApiResponse, logger } from "@matcha/shared";

export class ApiService extends BaseService {
	private baseUrl: string;

	constructor(container: IContainer) {
		super(container);
		this.baseUrl = API_BASE_URL;
	}

	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		const response = (await fetch(`${this.baseUrl}${endpoint}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})) as Response & ApiResponse<T>;

		if (!response.ok) {
			const error = new Error(`HTTP error! status: ${response.status}`);
			error.name = "HTTPError";
			throw error;
		}

		return response.json();
	}

	async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const responseData = (await response.json()) as ApiResponse<T>;

		if (!response.ok) {
			logger.error("ApiService.post error", responseData);
			throw new Error(
				responseData.message || `HTTP error! status: ${response.status}`
			);
		}

		return response.json();
	}
}
