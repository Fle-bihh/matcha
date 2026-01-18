import { BaseRepository } from "./base.repository";
import { Report, logger } from "@matcha/shared";
import { IContainer, IRepository, TableSchema } from "@/types";

export class ReportRepository extends BaseRepository implements IRepository {
	private readonly tableName = "reports";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				reported_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				reason TEXT
			`,
			constraints: `CONSTRAINT no_self_report CHECK (reporter_id != reported_id)`,
		};
	}

	public async createReport(
		reporterId: number,
		reportedId: number,
		reason?: string,
	): Promise<Report | null> {
		try {
			return await this.createDocument<Report>(this.tableName, {
				reporter_id: reporterId,
				reported_id: reportedId,
				reason,
			});
		} catch (error) {
			logger.error("Error creating report:", error);
			return null;
		}
	}
}
