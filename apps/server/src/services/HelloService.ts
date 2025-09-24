import {
	GetHealthRequestDto,
	GetHealthResponseDto,
	GetHelloRequestDto,
	GetHelloResponseDto,
} from "@/dto";
import { TestValue, CreateTestValue } from "@/models/HelloModels";
import { ServiceResponse } from "@/types/ServiceResponse";
import { StatusCodes } from "http-status-codes";
import { HelloRepository } from "@/repositories";

export class HelloService {
	private startTime = Date.now();
	private helloRepository: HelloRepository;

	constructor(helloRepository: HelloRepository) {
		this.helloRepository = helloRepository;
	}

	async initializeTable(): Promise<void> {
		await this.helloRepository.initializeTable();
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
			const newValue = await this.helloRepository.createTestValue(data);
			return ServiceResponse.success("Test value created", newValue);
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to create test value",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getTestValueByName(
		name: string
	): Promise<ServiceResponse<TestValue | null>> {
		try {
			const value = await this.helloRepository.getTestValueByName(name);
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
}
