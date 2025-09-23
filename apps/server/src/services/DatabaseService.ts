import mysql from "mysql2/promise";
import { config } from "@/config";
import { DocumentWithMetadata } from "@/validation/CommonValidation";

export class DatabaseService {
	private connection: mysql.Connection | null = null;

	async connect(): Promise<void> {
		try {
			this.connection = await mysql.createConnection({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password,
				database: config.database.database,
			});

			console.log(`Connected to database at ${config.database.host}`);
		} catch (error) {
			console.error("Database connection failed:", error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		if (this.connection) {
			await this.connection.end();
			this.connection = null;
		}
	}

	async createDocument<T extends Record<string, any>>(
		tableName: string,
		data: Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">
	): Promise<T & DocumentWithMetadata> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const fields = Object.keys(data);
		const values = Object.values(data);
		const placeholders = fields.map(() => "?").join(", ");
		const fieldsList = fields.join(", ");

		const [result] = await this.connection.execute(
			`INSERT INTO ${tableName} (${fieldsList}) VALUES (${placeholders})`,
			values
		);

		const insertId = (result as any).insertId;
		const created = await this.getDoc<T>(tableName, insertId);

		if (!created) {
			throw new Error(
				`Failed to retrieve created document from ${tableName}`
			);
		}

		return created;
	}

	async updateDoc<T extends Record<string, any>>(
		tableName: string,
		id: number,
		data: Partial<
			Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">
		>
	): Promise<(T & DocumentWithMetadata) | null> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const updateFields = Object.keys(data).filter(
			(key) => data[key] !== undefined
		);

		if (updateFields.length === 0) {
			return this.getDoc<T>(tableName, id);
		}

		const setClause = updateFields
			.map((field) => `${field} = ?`)
			.join(", ");
		const values: any[] = updateFields.map((field) => data[field]);
		values.push(id);

		await this.connection.execute(
			`UPDATE ${tableName} SET ${setClause} WHERE id = ? AND deleted_at IS NULL`,
			values
		);

		return this.getDoc<T>(tableName, id);
	}

	async deleteDoc(tableName: string, id: number): Promise<boolean> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const [result] = await this.connection.execute(
			`UPDATE ${tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
			[id]
		);

		return (result as any).affectedRows > 0;
	}

	async hardDeleteDoc(tableName: string, id: number): Promise<boolean> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const [result] = await this.connection.execute(
			`DELETE FROM ${tableName} WHERE id = ?`,
			[id]
		);

		return (result as any).affectedRows > 0;
	}

	async getDoc<T extends Record<string, any>>(
		tableName: string,
		id: number,
		includeDeleted: boolean = false
	): Promise<(T & DocumentWithMetadata) | null> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const whereClause = includeDeleted
			? "WHERE id = ?"
			: "WHERE id = ? AND deleted_at IS NULL";

		const [rows] = await this.connection.execute(
			`SELECT * FROM ${tableName} ${whereClause}`,
			[id]
		);

		const results = rows as (T & DocumentWithMetadata)[];
		return results[0] || null;
	}

	async getDocs<T extends Record<string, any>>(
		tableName: string,
		options: {
			where?: string;
			values?: any[];
			orderBy?: string;
			limit?: number;
			offset?: number;
			includeDeleted?: boolean;
		} = {}
	): Promise<(T & DocumentWithMetadata)[]> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const {
			where = "",
			values = [],
			orderBy = "created_at DESC",
			limit,
			offset,
			includeDeleted = false,
		} = options;

		let query = `SELECT * FROM ${tableName}`;
		let queryValues = [...values];

		// Construire la clause WHERE
		const conditions: string[] = [];

		if (!includeDeleted) {
			conditions.push("deleted_at IS NULL");
		}

		if (where) {
			conditions.push(where);
		}

		if (conditions.length > 0) {
			query += ` WHERE ${conditions.join(" AND ")}`;
		}

		// Ajouter ORDER BY
		if (orderBy) {
			query += ` ORDER BY ${orderBy}`;
		}

		// Ajouter LIMIT et OFFSET
		if (limit) {
			query += ` LIMIT ?`;
			queryValues.push(limit);
		}

		if (offset) {
			query += ` OFFSET ?`;
			queryValues.push(offset);
		}

		const [rows] = await this.connection.execute(query, queryValues);
		return rows as (T & DocumentWithMetadata)[];
	}

	async countDocs(
		tableName: string,
		options: {
			where?: string;
			values?: any[];
			includeDeleted?: boolean;
		} = {}
	): Promise<number> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const { where = "", values = [], includeDeleted = false } = options;

		let query = `SELECT COUNT(*) as count FROM ${tableName}`;
		const queryValues = [...values];

		const conditions: string[] = [];

		if (!includeDeleted) {
			conditions.push("deleted_at IS NULL");
		}

		if (where) {
			conditions.push(where);
		}

		if (conditions.length > 0) {
			query += ` WHERE ${conditions.join(" AND ")}`;
		}

		const [rows] = await this.connection.execute(query, queryValues);
		const result = rows as { count: number }[];
		return result[0]?.count || 0;
	}

	async restoreDoc(tableName: string, id: number): Promise<boolean> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const [result] = await this.connection.execute(
			`UPDATE ${tableName} SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL`,
			[id]
		);

		return (result as any).affectedRows > 0;
	}

	async createTableWithMetadata(
		tableName: string,
		fields: string,
		additionalConstraints: string = ""
	): Promise<void> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

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

		await this.connection.execute(query);
	}
}
