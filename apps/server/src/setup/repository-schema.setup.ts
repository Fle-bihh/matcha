import { Container } from "@/container/container";
import { BaseRepository, UserRepository } from "@/repositories";
import { ETokens } from "@/types";
import { IRepository, TableSchema } from "@/types/repository.types";
import { logger } from "@matcha/shared";

export class RepositorySchemaSetup {
	private container: Container;

	constructor(container: Container) {
		this.container = container;
	}

	public async initialize(): Promise<void> {
		try {
			logger.info("Initializing repository schemas...");

			const repositories = this.container.getRepositories();

			for (const repository of repositories) {
				await this.initializeRepositorySchema(repository);
			}

			await this.seedUserRepository();

			logger.info("Repository schemas initialized successfully");
		} catch (error) {
			logger.error("Failed to initialize repository schemas:", error);
			throw error;
		}
	}

	private async initializeRepositorySchema(
		repository: IRepository
	): Promise<void> {
		const schema = repository.loadTableSchema();
		const { tableName, fields, constraints } = schema;

		if (!tableName || !fields) {
			logger.debug(`Skipping repository without table schema`);
			return;
		}

		logger.debug(`Initializing schema for table: ${tableName}`);

		const baseRepository = this.container.get<BaseRepository>(
			ETokens.BaseRepository
		);

		const tableExists = await this.tableExists(tableName);

		if (!tableExists) {
			logger.info(`Creating table: ${tableName}`);
			await baseRepository.createTableWithMetadata(
				tableName,
				fields,
				constraints
			);
			return;
		}

		const hasMetadata = await baseRepository.hasMetadataColumns(tableName);

		if (!hasMetadata) {
			logger.info(`Adding metadata columns to table: ${tableName}`);
			await baseRepository.ensureMetadataColumns(tableName);
		}

		const schemaMatches = await this.verifySchema(schema);

		if (!schemaMatches) {
			logger.warn(
				`Schema mismatch for table: ${tableName}. Manual migration required.`
			);
		} else {
			logger.debug(`Table ${tableName} is up to date`);
		}
	}

	private async seedUserRepository(): Promise<void> {
		const userRepository = this.container.get<UserRepository>(
			ETokens.UserRepository
		);
		await userRepository.seedDatabaseIfEmpty();
	}

	private async tableExists(tableName: string): Promise<boolean> {
		const baseRepository = this.container.get<BaseRepository>(
			ETokens.BaseRepository
		);

		const query = `
			SELECT EXISTS (
				SELECT 1 FROM information_schema.tables 
				WHERE table_name = ?
			) as table_exists
		`;

		const [rows] = await baseRepository.executeQuery<{
			table_exists: boolean;
		}>(query, [tableName]);

		return rows[0]?.table_exists ?? false;
	}

	private async verifySchema(schema: TableSchema): Promise<boolean> {
		const baseRepository = this.container.get<BaseRepository>(
			ETokens.BaseRepository
		);

		const columnsQuery = `
			SELECT column_name, data_type, is_nullable, column_default
			FROM information_schema.columns
			WHERE table_name = ?
			ORDER BY ordinal_position
		`;

		const [columns] = await baseRepository.executeQuery<{
			column_name: string;
			data_type: string;
			is_nullable: string;
			column_default: string | null;
		}>(columnsQuery, [schema.tableName]);

		const constraintsQuery = `
			SELECT constraint_name, constraint_type
			FROM information_schema.table_constraints
			WHERE table_name = ?
		`;

		const [constraints] = await baseRepository.executeQuery<{
			constraint_name: string;
			constraint_type: string;
		}>(constraintsQuery, [schema.tableName]);

		logger.debug(
			`Table ${schema.tableName} - Columns: ${columns.length}, Constraints: ${constraints.length}`
		);

		return false;
	}
}
