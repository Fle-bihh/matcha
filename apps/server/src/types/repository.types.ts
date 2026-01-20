export interface TableSchema {
	tableName: string;
	fields: string;
	constraints: string;
}

export interface IRepository {
	loadTableSchema(): TableSchema;
}
