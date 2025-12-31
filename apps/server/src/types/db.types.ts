export interface QueryOptions {
	where?: string;
	values?: any[];
	orderBy?: string;
	limit?: number;
	offset?: number;
	includeDeleted?: boolean;
}
