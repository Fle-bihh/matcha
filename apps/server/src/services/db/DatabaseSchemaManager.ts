import { DatabaseConnectionManager } from "./DatabaseConnectionManager";

export class DatabaseSchemaManager {
	private connectionManager: DatabaseConnectionManager;

	constructor() {
		this.connectionManager = DatabaseConnectionManager.getInstance();
	}

	async createTableWithMetadata(
		tableName: string,
		fields: string,
		additionalConstraints: string = ""
	): Promise<void> {
		const connection = this.connectionManager.getConnection();

		const query = `
			CREATE TABLE IF NOT EXISTS ${tableName} (
				id INT AUTO_INCREMENT PRIMARY KEY,
				${fields},
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				deleted_at TIMESTAMP NULL
				${additionalConstraints ? "," + additionalConstraints : ""}
			)
		`;

		await connection.execute(query);

		await this.ensureMetadataColumns(tableName);
	}

	async ensureMetadataColumns(tableName: string): Promise<void> {
		const connection = this.connectionManager.getConnection();

		const [columns] = await connection.execute(
			`SHOW COLUMNS FROM ${tableName}`
		);

		const existingColumns = (columns as any[]).map((col) => col.Field);
		let hasChanges = false;

		if (!existingColumns.includes("created_at")) {
			await connection.execute(
				`ALTER TABLE ${tableName} ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
			);
			hasChanges = true;
		}

		if (!existingColumns.includes("updated_at")) {
			await connection.execute(
				`ALTER TABLE ${tableName} ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
			);
			hasChanges = true;
		}

		if (!existingColumns.includes("deleted_at")) {
			await connection.execute(
				`ALTER TABLE ${tableName} ADD COLUMN deleted_at TIMESTAMP NULL`
			);
			hasChanges = true;
		}

		// Clear cache if we made changes
		if (hasChanges) {
			// Note: We would need access to DatabaseOperations instance to clear cache
			// For now, we'll rely on the cache timeout or manual clearing
		}
	}

	async hasMetadataColumns(tableName: string): Promise<boolean> {
		const connection = this.connectionManager.getConnection();

		const [columns] = await connection.execute(
			`SHOW COLUMNS FROM ${tableName}`
		);

		const existingColumns = (columns as any[]).map((col) => col.Field);

		return (
			existingColumns.includes("created_at") &&
			existingColumns.includes("updated_at") &&
			existingColumns.includes("deleted_at")
		);
	}
}
