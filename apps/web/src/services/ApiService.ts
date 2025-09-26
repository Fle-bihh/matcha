import { logger } from "@matcha/shared";
import { IContainer } from "@/types/container";
import { BaseService } from "./BaseService";
import { API_BASE_URL } from "@/constants/api";

export class ApiService extends BaseService {
	private baseUrl: string;

	constructor(container: IContainer) {
		super(container);
		this.baseUrl = API_BASE_URL;
	}

	async get<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	async post<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}
}
