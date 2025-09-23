import { DatabaseConnectionManager } from "./DatabaseConnectionManager";
import { DatabaseOperations } from "./DatabaseOperations";
import { DatabaseSchemaManager } from "./DatabaseSchemaManager";
import { DocumentWithMetadata } from "@/validation/CommonValidation";

export class DatabaseService {
	private connectionManager: DatabaseConnectionManager;
	private operations: DatabaseOperations;
	private schemaManager: DatabaseSchemaManager;

	constructor() {
		this.connectionManager = DatabaseConnectionManager.getInstance();
		this.operations = new DatabaseOperations();
		this.schemaManager = new DatabaseSchemaManager();
	}

	async connect(): Promise<void> {
		return this.connectionManager.connect();
	}

	async disconnect(): Promise<void> {
		return this.connectionManager.disconnect();
	}

	async createDocument<T extends Record<string, any>>(
		tableName: string,
		data: Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">
	): Promise<T & DocumentWithMetadata> {
		return this.operations.createDocument<T>(tableName, data);
	}

	async updateDoc<T extends Record<string, any>>(
		tableName: string,
		id: number,
		data: Partial<
			Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">
		>
	): Promise<(T & DocumentWithMetadata) | null> {
		return this.operations.updateDoc<T>(tableName, id, data);
	}

	async deleteDoc(tableName: string, id: number): Promise<boolean> {
		return this.operations.deleteDoc(tableName, id);
	}

	async hardDeleteDoc(tableName: string, id: number): Promise<boolean> {
		return this.operations.hardDeleteDoc(tableName, id);
	}

	async getDoc<T extends Record<string, any>>(
		tableName: string,
		id: number,
		includeDeleted: boolean = false
	): Promise<(T & DocumentWithMetadata) | null> {
		return this.operations.getDoc<T>(tableName, id, includeDeleted);
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
		return this.operations.getDocs<T>(tableName, options);
	}

	async countDocs(
		tableName: string,
		options: {
			where?: string;
			values?: any[];
			includeDeleted?: boolean;
		} = {}
	): Promise<number> {
		return this.operations.countDocs(tableName, options);
	}

	async restoreDoc(tableName: string, id: number): Promise<boolean> {
		return this.operations.restoreDoc(tableName, id);
	}

	async createTableWithMetadata(
		tableName: string,
		fields: string,
		additionalConstraints: string = ""
	): Promise<void> {
		return this.schemaManager.createTableWithMetadata(
			tableName,
			fields,
			additionalConstraints
		);
	}

	async ensureMetadataColumns(tableName: string): Promise<void> {
		await this.schemaManager.ensureMetadataColumns(tableName);
		// Clear cache after potentially adding metadata columns
		this.operations.clearMetadataCache(tableName);
	}

	async hasMetadataColumns(tableName: string): Promise<boolean> {
		return this.schemaManager.hasMetadataColumns(tableName);
	}

	clearMetadataCache(tableName?: string): void {
		this.operations.clearMetadataCache(tableName);
	}
}
