import { DatabaseConnectionManager } from "./database-connection-manager";

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
    const pool = this.connectionManager.getPool();

    const [tables] = await pool.execute(`SHOW TABLES LIKE '${tableName}'`);

    if ((tables as any[]).length === 0) {
      const query = `
				CREATE TABLE ${tableName} (
					id INT AUTO_INCREMENT PRIMARY KEY,
					${fields},
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					deleted_at TIMESTAMP NULL
					${additionalConstraints ? "," + additionalConstraints : ""}
				)
			`;
      await pool.execute(query);
    } else {
      await this.ensureFieldsMatch(tableName, fields);
      await this.ensureMetadataColumns(tableName);
    }
  }

  private parseFieldDefinitions(
    fields: string
  ): { name: string; definition: string }[] {
    return fields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0)
      .map((field) => {
        const parts = field.trim().split(/\s+/);
        const name = parts[0];
        const definition = parts.slice(1).join(" ");
        return { name, definition };
      });
  }

  private async ensureFieldsMatch(
    tableName: string,
    fields: string
  ): Promise<void> {
    const pool = this.connectionManager.getPool();
    const [columns] = await pool.execute(`SHOW COLUMNS FROM ${tableName}`);
    const existingColumns = (columns as any[]).map((col) => col.Field);

    const requiredFields = this.parseFieldDefinitions(fields);

    for (const { name, definition } of requiredFields) {
      if (!existingColumns.includes(name)) {
        await pool.execute(
          `ALTER TABLE ${tableName} ADD COLUMN ${name} ${definition}`
        );
      }
    }
  }

  async ensureMetadataColumns(tableName: string): Promise<void> {
    const pool = this.connectionManager.getPool();

    const [columns] = await pool.execute(`SHOW COLUMNS FROM ${tableName}`);

    const existingColumns = (columns as any[]).map((col) => col.Field);
    let hasChanges = false;

    if (!existingColumns.includes("created_at")) {
      await pool.execute(
        `ALTER TABLE ${tableName} ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
      );
      hasChanges = true;
    }

    if (!existingColumns.includes("updated_at")) {
      await pool.execute(
        `ALTER TABLE ${tableName} ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
      );
      hasChanges = true;
    }

    if (!existingColumns.includes("deleted_at")) {
      await pool.execute(
        `ALTER TABLE ${tableName} ADD COLUMN deleted_at TIMESTAMP NULL`
      );
      hasChanges = true;
    }

    // Clear cache if we made changes
    if (hasChanges) {
      // Note: We would need access to DatabaseOperations instance to clear cache
    }
  }

  async hasMetadataColumns(tableName: string): Promise<boolean> {
    const pool = this.connectionManager.getPool();

    const [columns] = await pool.execute(`SHOW COLUMNS FROM ${tableName}`);

    const existingColumns = (columns as any[]).map((col) => col.Field);

    return (
      existingColumns.includes("created_at") &&
      existingColumns.includes("updated_at") &&
      existingColumns.includes("deleted_at")
    );
  }

  async ensureColumnsExist(
    tableName: string,
    columnDefinitions: { name: string; definition: string }[]
  ): Promise<void> {
    const pool = this.connectionManager.getPool();

    const [columns] = await pool.execute(`SHOW COLUMNS FROM ${tableName}`);
    const existingColumns = (columns as any[]).map((col) => col.Field);

    for (const { name, definition } of columnDefinitions) {
      if (!existingColumns.includes(name)) {
        await pool.execute(
          `ALTER TABLE ${tableName} ADD COLUMN ${name} ${definition}`
        );
      }
    }
  }
}
