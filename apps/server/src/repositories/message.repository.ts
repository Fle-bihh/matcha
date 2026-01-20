import { BaseRepository } from "./base.repository";
import { IContainer, IRepository, TableSchema } from "@/types";

export class MessageRepository extends BaseRepository implements IRepository {
	private readonly tableName = "messages";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				type VARCHAR(10) NOT NULL CHECK (type IN ('user', 'system')),
				sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
				match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
				content TEXT,
				system_type VARCHAR(50),
				data JSON
			`,
			constraints: "",
		};
	}
}
