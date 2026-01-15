import { BaseRepository } from "./base.repository";
import { Message } from "@matcha/shared";
import { IContainer } from "@/types";
import { IRepository, TableSchema } from "@/types/repository.types";

export class MessageRepository extends BaseRepository implements IRepository {
	private readonly tableName = "messages";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
				content TEXT NOT NULL,
				is_read BOOLEAN DEFAULT FALSE NOT NULL
			`,
			constraints: "",
		};
	}
}
