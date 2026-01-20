import { BaseRepository } from "./base.repository";
import { Block, logger } from "@matcha/shared";
import { IContainer, IRepository, TableSchema } from "@/types";

export class BlockRepository extends BaseRepository implements IRepository {
	private readonly tableName = "blocks";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				blocker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				blocked_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
			`,
			constraints: `CONSTRAINT no_self_block CHECK (blocker_id != blocked_id)`,
		};
	}

	public async createBlock(
		blockerId: number,
		blockedId: number,
	): Promise<Block | null> {
		try {
			return await this.createDocument<Block>(this.tableName, {
				blocker_id: blockerId,
				blocked_id: blockedId,
			});
		} catch (error) {
			logger.error("Error creating block:", error);
			return null;
		}
	}

	public async checkBlockExists(
		blockerId: number,
		blockedId: number,
	): Promise<boolean> {
		try {
			const blocks = await this.getDocs<Block>(this.tableName, {
				where: "blocker_id = ? AND blocked_id = ?",
				values: [blockerId, blockedId],
				limit: 1,
			});
			return blocks.length > 0;
		} catch (error) {
			logger.error("Error checking block existence:", error);
			return false;
		}
	}
}
