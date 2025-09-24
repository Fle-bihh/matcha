import {
	GetHealthRequestDto,
	GetHealthResponseDto,
	GetHelloRequestDto,
	GetHelloResponseDto,
} from "@/dto";
import { DatabaseService } from "./db";
import {
	TestValue,
	CreateTestValue,
	UpdateTestValue,
} from "@/models/HelloModels";
import { ServiceResponse } from "@/types/ServiceResponse";
import { StatusCodes } from "http-status-codes";

export class HelloService {
	private startTime = Date.now();
	private dbService: DatabaseService;
	private readonly tableName = "test_values";

	constructor(dbService: DatabaseService) {
		this.dbService = dbService;
	}

	async initializeTable(): Promise<void> {
		await this.dbService.createTableWithMetadata(
			this.tableName,
			`name VARCHAR(255) NOT NULL,
			 value VARCHAR(255) NOT NULL`
		);

		const count = await this.dbService.countDocs(this.tableName);
		if (count === 0) {
			await this.createTestValue({
				name: "test_connection",
				value: "Database connection successful!",
			});
		}
	}

	public getGreeting(
		dto: GetHelloRequestDto
	): ServiceResponse<GetHelloResponseDto> {
		const { name, greeting_type = "standard" } = dto;
		let message: string;

		switch (greeting_type) {
			case "random":
				message = this.getRandomGreeting(name);
				break;
			case "formal":
				message = this.getFormalGreeting(name);
				break;
			default:
				message = this.getStandardGreeting(name);
				break;
		}

		return ServiceResponse.success("Greeting generated", {
			message,
			greeting_type,
			timestamp: new Date().toISOString(),
		});
	}

	private getStandardGreeting(name?: string): string {
		if (name) {
			return `Hello, ${name}!`;
		}
		return "Hello World!";
	}

	private getRandomGreeting(name?: string): string {
		const greetings = [
			"Hello!",
			"Hi there!",
			"Greetings!",
			"Hey!",
			"Good day!",
		];
		const randomIndex = Math.floor(Math.random() * greetings.length);
		const baseGreeting = greetings[randomIndex];

		if (name) {
			return `${baseGreeting} ${name}!`;
		}
		return baseGreeting;
	}

	private getFormalGreeting(name?: string): string {
		if (name) {
			return `Good day, ${name}. I hope this message finds you well.`;
		}
		return "Good day. I hope this message finds you well.";
	}

	public getHealthStatus(
		dto: GetHealthRequestDto
	): ServiceResponse<GetHealthResponseDto> {
		const { include_details: includeDetails = false } = dto;
		const baseStatus = {
			status: "healthy",
			timestamp: new Date().toISOString(),
			service: "HelloService",
		};

		if (includeDetails) {
			return ServiceResponse.success("Health status with details", {
				...baseStatus,
				uptime: Date.now() - this.startTime,
				details: {
					memory_usage: process.memoryUsage(),
					cpu_usage: process.cpuUsage().user / 1000000,
				},
			});
		}

		return ServiceResponse.success("Basic health status", baseStatus);
	}

	public async createTestValue(
		data: CreateTestValue
	): Promise<ServiceResponse<TestValue | null>> {
		try {
			const newValue = await this.dbService.createDocument<TestValue>(
				this.tableName,
				data
			);
			return ServiceResponse.success("Test value created", newValue);
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to create test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getTestValueById(
		id: number
	): Promise<ServiceResponse<TestValue | null>> {
		try {
			const value = await this.dbService.getDoc<TestValue>(
				this.tableName,
				id
			);
			if (value) {
				return ServiceResponse.success("Test value found", value);
			} else {
				return ServiceResponse.failure(
					"Test value not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ServiceResponse.failure(
				"Error retrieving test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getAllTestValues(
		includeDeleted: boolean = false
	): Promise<ServiceResponse<TestValue[]>> {
		try {
			const values = await this.dbService.getDocs<TestValue>(
				this.tableName,
				{
					includeDeleted,
					orderBy: "created_at DESC",
				}
			);
			return ServiceResponse.success("Test values retrieved", values);
		} catch (error) {
			return ServiceResponse.failure(
				"Error retrieving test values",
				[],
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async updateTestValue(
		data: UpdateTestValue
	): Promise<ServiceResponse<TestValue | null>> {
		const { id, ...updateData } = data;
		try {
			const updatedValue = await this.dbService.updateDoc<TestValue>(
				this.tableName,
				id,
				updateData
			);
			if (updatedValue) {
				return ServiceResponse.success(
					"Test value updated",
					updatedValue
				);
			} else {
				return ServiceResponse.failure(
					"Test value not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to update test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async deleteTestValue(id: number): Promise<ServiceResponse<null>> {
		try {
			const success = await this.dbService.deleteDoc(this.tableName, id);
			if (success) {
				return ServiceResponse.success("Test value deleted", null);
			} else {
				return ServiceResponse.failure(
					"Test value not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to delete test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async restoreTestValue(id: number): Promise<ServiceResponse<null>> {
		try {
			const success = await this.dbService.restoreDoc(this.tableName, id);
			if (success) {
				return ServiceResponse.success("Test value restored", null);
			} else {
				return ServiceResponse.failure(
					"Test value not found or not deleted",
					null,
					StatusCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to restore test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getTestValueByName(
		name: string
	): Promise<ServiceResponse<TestValue | null>> {
		try {
			const results = await this.dbService.getDocs<TestValue>(
				this.tableName,
				{
					where: "name = ?",
					values: [name],
					limit: 1,
				}
			);
			const value = results[0] || null;
			if (value) {
				return ServiceResponse.success("Test value found", value);
			} else {
				return ServiceResponse.failure(
					"Test value not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ServiceResponse.failure(
				"Error retrieving test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getTestValue(): Promise<ServiceResponse<string>> {
		try {
			const testValueResponse = await this.getTestValueByName(
				"test_connection"
			);
			if (testValueResponse.success && testValueResponse.responseObject) {
				return ServiceResponse.success(
					"Test value retrieved",
					testValueResponse.responseObject.value
				);
			} else {
				return ServiceResponse.failure(
					"No test value found",
					"",
					StatusCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ServiceResponse.failure(
				"Error retrieving test value",
				"",
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async searchTestValues(
		searchTerm: string
	): Promise<ServiceResponse<TestValue[]>> {
		try {
			const results = await this.dbService.getDocs<TestValue>(
				this.tableName,
				{
					where: "name LIKE ? OR value LIKE ?",
					values: [`%${searchTerm}%`, `%${searchTerm}%`],
					orderBy: "created_at DESC",
				}
			);
			return ServiceResponse.success("Search completed", results);
		} catch (error) {
			return ServiceResponse.failure(
				"Error searching test values",
				[],
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async countTestValues(): Promise<ServiceResponse<number>> {
		try {
			const count = await this.dbService.countDocs(this.tableName);
			return ServiceResponse.success("Count retrieved", count);
		} catch (error) {
			return ServiceResponse.failure(
				"Error counting test values",
				0,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
