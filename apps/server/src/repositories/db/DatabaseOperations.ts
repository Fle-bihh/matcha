import { DatabaseConnectionManager } from "./DatabaseConnectionManager";
import { DatabaseSchemaManager } from "./DatabaseSchemaManager";
import { DocumentWithMetadata } from "@matcha/shared";

export class DatabaseOperations {
	private connectionManager: DatabaseConnectionManager;
	private schemaManager: DatabaseSchemaManager;
	private metadataCache: Map<string, boolean> = new Map();

	constructor() {
		this.connectionManager = DatabaseConnectionManager.getInstance();
		this.schemaManager = new DatabaseSchemaManager();
	}

	private async hasMetadataColumns(tableName: string): Promise<boolean> {
		if (this.metadataCache.has(tableName)) {
			return this.metadataCache.get(tableName)!;
		}

		const hasMetadata = await this.schemaManager.hasMetadataColumns(
			tableName
		);
		this.metadataCache.set(tableName, hasMetadata);
		return hasMetadata;
	}

	public clearMetadataCache(tableName?: string): void {
		if (tableName) {
			this.metadataCache.delete(tableName);
		} else {
			this.metadataCache.clear();
		}
	}

	async createDocument<T extends Record<string, any>>(
		tableName: string,
		data: Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">
	): Promise<T & DocumentWithMetadata> {
		const pool = this.connectionManager.getPool();

		const fields = Object.keys(data);
		const values = Object.values(data);
		const placeholders = fields.map(() => "?").join(", ");
		const fieldsList = fields.join(", ");

		const [result] = await pool.execute(
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
		const pool = this.connectionManager.getPool();
		const hasMetadata = await this.hasMetadataColumns(tableName);

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

		const whereClause = hasMetadata
			? "WHERE id = ? AND deleted_at IS NULL"
			: "WHERE id = ?";

		await pool.execute(
			`UPDATE ${tableName} SET ${setClause} ${whereClause}`,
			values
		);

		return this.getDoc<T>(tableName, id);
	}

	async deleteDoc(tableName: string, id: number): Promise<boolean> {
		const pool = this.connectionManager.getPool();
		const hasMetadata = await this.hasMetadataColumns(tableName);

		if (hasMetadata) {
			const [result] = await pool.execute(
				`UPDATE ${tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
				[id]
			);
			return (result as any).affectedRows > 0;
		} else {
			// Fallback to hard delete if no metadata columns
			return this.hardDeleteDoc(tableName, id);
		}
	}

	async hardDeleteDoc(tableName: string, id: number): Promise<boolean> {
		const pool = this.connectionManager.getPool();

		const [result] = await pool.execute(
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
		const pool = this.connectionManager.getPool();
		const hasMetadata = await this.hasMetadataColumns(tableName);

		const whereClause =
			hasMetadata && !includeDeleted
				? "WHERE id = ? AND deleted_at IS NULL"
				: "WHERE id = ?";

		const [rows] = await pool.execute(
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
		const pool = this.connectionManager.getPool();
		const hasMetadata = await this.hasMetadataColumns(tableName);

		const {
			where = "",
			values = [],
			orderBy = hasMetadata ? "created_at DESC" : "id DESC",
			limit,
			offset,
			includeDeleted = false,
		} = options;

		let query = `SELECT * FROM ${tableName}`;
		let queryValues: any[] = [];

		// Construire la clause WHERE
		const conditions: string[] = [];

		if (hasMetadata && !includeDeleted) {
			conditions.push("deleted_at IS NULL");
		}

		if (where) {
			conditions.push(where);
			queryValues.push(...values);
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
			const limitValue = parseInt(limit.toString(), 10);
			if (isNaN(limitValue) || limitValue < 0) {
				throw new Error(`Invalid limit value: ${limit}`);
			}
			query += ` LIMIT ${limitValue}`;
		}

		if (offset) {
			const offsetValue = parseInt(offset.toString(), 10);
			if (isNaN(offsetValue) || offsetValue < 0) {
				throw new Error(`Invalid offset value: ${offset}`);
			}
			query += ` OFFSET ${offsetValue}`;
		}

		const [rows] = await pool.execute(query, queryValues);
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
		const pool = this.connectionManager.getPool();
		const hasMetadata = await this.hasMetadataColumns(tableName);

		const { where = "", values = [], includeDeleted = false } = options;

		let query = `SELECT COUNT(*) as count FROM ${tableName}`;
		let queryValues: any[] = [];

		const conditions: string[] = [];

		if (hasMetadata && !includeDeleted) {
			conditions.push("deleted_at IS NULL");
		}

		if (where) {
			conditions.push(where);
			queryValues.push(...values);
		}

		if (conditions.length > 0) {
			query += ` WHERE ${conditions.join(" AND ")}`;
		}

		const [rows] = await pool.execute(query, queryValues);
		const result = rows as { count: number }[];
		return result[0]?.count || 0;
	}

	async restoreDoc(tableName: string, id: number): Promise<boolean> {
		const pool = this.connectionManager.getPool();
		const hasMetadata = await this.hasMetadataColumns(tableName);

		if (!hasMetadata) {
			throw new Error(
				`Table ${tableName} does not support soft delete/restore operations`
			);
		}

		const [result] = await pool.execute(
			`UPDATE ${tableName} SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL`,
			[id]
		);

		return (result as any).affectedRows > 0;
	}
}
