import { logger } from "@matcha/shared";
import { IContainer } from "../types/container";

export abstract class BaseService {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}
}

export class ApiService extends BaseService {
	private baseUrl: string;

	constructor(container: IContainer) {
		super(container);
		this.baseUrl = "http://localhost:3000/api/v1"; // URL du serveur
	}

	async get<T>(endpoint: string): Promise<T> {
		logger.debug(`GET request to ${this.baseUrl}${endpoint}`);
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		logger.debug(
			`Response from ${this.baseUrl}${endpoint}: ${response.status}`
		);

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
