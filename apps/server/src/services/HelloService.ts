import { DatabaseService } from "./DatabaseService";
import {
	TestValue,
	CreateTestValue,
	UpdateTestValue,
} from "@/models/HelloModels";

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

		// Vérifier s'il y a des données, sinon créer un enregistrement de test
		const count = await this.dbService.countDocs(this.tableName);
		if (count === 0) {
			await this.createTestValue({
				name: "test_connection",
				value: "Database connection successful!",
			});
		}
	}

	public getGreeting(
		name?: string,
		greetingType: "standard" | "random" | "formal" = "standard"
	): {
		message: string;
		greeting_type: string;
		timestamp: string;
	} {
		let message: string;

		switch (greetingType) {
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

		return {
			message,
			greeting_type: greetingType,
			timestamp: new Date().toISOString(),
		};
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

	public getHealthStatus(includeDetails = false): {
		status: string;
		timestamp: string;
		service: string;
		uptime?: number;
		details?: {
			memory_usage?: NodeJS.MemoryUsage;
			cpu_usage?: number;
		};
	} {
		const baseStatus = {
			status: "healthy",
			timestamp: new Date().toISOString(),
			service: "HelloService",
		};

		if (includeDetails) {
			return {
				...baseStatus,
				uptime: Date.now() - this.startTime,
				details: {
					memory_usage: process.memoryUsage(),
					cpu_usage: process.cpuUsage().user / 1000000, // Convert to seconds
				},
			};
		}

		return baseStatus;
	}

	// Méthodes spécifiques au modèle TestValue utilisant le DatabaseService générique

	async createTestValue(data: CreateTestValue): Promise<TestValue> {
		return this.dbService.createDocument<TestValue>(this.tableName, data);
	}

	async getTestValueById(id: number): Promise<TestValue | null> {
		return this.dbService.getDoc<TestValue>(this.tableName, id);
	}

	async getAllTestValues(
		includeDeleted: boolean = false
	): Promise<TestValue[]> {
		return this.dbService.getDocs<TestValue>(this.tableName, {
			includeDeleted,
			orderBy: "created_at DESC",
		});
	}

	async updateTestValue(data: UpdateTestValue): Promise<TestValue | null> {
		const { id, ...updateData } = data;
		return this.dbService.updateDoc<TestValue>(
			this.tableName,
			id,
			updateData
		);
	}

	async deleteTestValue(id: number): Promise<boolean> {
		return this.dbService.deleteDoc(this.tableName, id);
	}

	async restoreTestValue(id: number): Promise<boolean> {
		return this.dbService.restoreDoc(this.tableName, id);
	}

	async getTestValueByName(name: string): Promise<TestValue | null> {
		const results = await this.dbService.getDocs<TestValue>(
			this.tableName,
			{
				where: "name = ?",
				values: [name],
				limit: 1,
			}
		);
		return results[0] || null;
	}

	async getTestValue(): Promise<string> {
		const testValue = await this.getTestValueByName("test_connection");
		return testValue?.value || "No test value found";
	}

	async searchTestValues(searchTerm: string): Promise<TestValue[]> {
		return this.dbService.getDocs<TestValue>(this.tableName, {
			where: "name LIKE ? OR value LIKE ?",
			values: [`%${searchTerm}%`, `%${searchTerm}%`],
			orderBy: "created_at DESC",
		});
	}

	async countTestValues(): Promise<number> {
		return this.dbService.countDocs(this.tableName);
	}
}
