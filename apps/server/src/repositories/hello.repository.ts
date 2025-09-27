import { BaseRepository } from "./base.repository";
import { TestValue, CreateTestValue, logger } from "@matcha/shared";
import { IContainer } from "@/types/container.types";

export class HelloRepository extends BaseRepository {
	private readonly tableName = "test_values";

	constructor(container: IContainer) {
		super(container);
		this.initializeTable().catch((err) => {
			logger.error("Error initializing HelloRepository table:", err);
		});
	}

	async initializeTable(): Promise<void> {
		await this.createTableWithMetadata(
			this.tableName,
			`name VARCHAR(255) NOT NULL,
			 value VARCHAR(255) NOT NULL`
		);

		const count = await this.countDocs(this.tableName);
		if (count === 0) {
			await this.createTestValue({
				name: "test_connection",
				value: "Database connection successful!",
			});
		}
	}

	async createTestValue(data: CreateTestValue): Promise<TestValue> {
		return await this.createDocument<TestValue>(this.tableName, data);
	}

	async getTestValueByName(name: string): Promise<TestValue | null> {
		const results = await this.getDocs<TestValue>(this.tableName, {
			where: "name = ?",
			values: [name],
			limit: 1,
		});
		return results[0] || null;
	}

	async getTestValues(): Promise<TestValue[]> {
		return await this.getDocs<TestValue>(this.tableName);
	}
}
