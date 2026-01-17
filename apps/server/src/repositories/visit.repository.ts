import { BaseRepository } from "./base.repository";
import { Visit, logger, VisitWithVisitedUser } from "@matcha/shared";
import { IContainer } from "@/types";
import { IRepository, TableSchema } from "@/types/repository.types";

export class VisitRepository extends BaseRepository implements IRepository {
	private readonly tableName = "visits";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				visitor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				visited_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
			`,
			constraints: `CONSTRAINT no_self_visit CHECK (visitor_id != visited_id)`,
		};
	}

	public async createVisit(
		visitorId: number,
		visitedId: number
	): Promise<Visit | null> {
		try {
			return await this.createDocument<Visit>(this.tableName, {
				visitor_id: visitorId,
				visited_id: visitedId,
			});
		} catch (error) {
			logger.error("Error creating visit:", error);
			return null;
		}
	}

	public async getLastVisit(visitorId: number): Promise<Visit | null> {
		const visits = await this.getDocs<Visit>(this.tableName, {
			where: "visitor_id = ?",
			values: [visitorId],
			orderBy: "created_at DESC",
			limit: 1,
		});

		return visits.length > 0 ? visits[0] : null;
	}

	public async getVisitsMade(
		userId: number,
		page: number,
		limit: number
	): Promise<{ visits: VisitWithVisitedUser[]; total: number }> {
		try {
			const offset = (page - 1) * limit;

			const query = this.buildVisitsQuery(userId, limit, offset);
			const [rows] = await this.executeQuery<any>(query, []);
			const visits = rows.map((row) =>
				this.mapRowToVisitWithVisitedUser(row)
			);

			const total = await this.countDocs(this.tableName, {
				where: "visitor_id = ?",
				values: [userId],
			});

			return { visits, total };
		} catch (error) {
			logger.error("Error fetching visits made:", error);
			return { visits: [], total: 0 };
		}
	}

	private buildVisitsQuery(
		userId: number,
		limit: number,
		offset: number
	): string {
		return `
			SELECT 
				v.id,
				v.visitor_id,
				v.visited_id,
				v.created_at,
				v.updated_at,
				v.deleted_at,
				u.id as user_id,
				u.first_name,
				u.last_name,
				u.gender,
				u.orientation,
				u.age,
				u.bio,
				u.pictures_urls,
				u.interests,
				u.location,
				u.fame_score,
				u.created_at as user_created_at,
				u.updated_at as user_updated_at,
				u.deleted_at as user_deleted_at
			FROM visits v
			INNER JOIN users u ON u.id = v.visited_id
			WHERE v.visitor_id = ${userId}
				AND v.deleted_at IS NULL
				AND u.deleted_at IS NULL
			ORDER BY v.created_at DESC
			LIMIT ${limit} OFFSET ${offset}
		`;
	}

	private mapRowToVisitWithVisitedUser(row: any): VisitWithVisitedUser {
		const user = {
			id: row.user_id,
			first_name: row.first_name,
			last_name: row.last_name,
			gender: row.gender,
			orientation: row.orientation,
			age: row.age,
			bio: row.bio,
			pictures_urls: row.pictures_urls,
			interests: row.interests,
			location: row.location,
			fame_score: row.fame_score,
			created_at: row.user_created_at,
			updated_at: row.user_updated_at,
			deleted_at: row.user_deleted_at,
		};

		return {
			id: row.id,
			visitor_id: row.visitor_id,
			visited_id: row.visited_id,
			created_at: row.created_at,
			visited: user,
		};
	}
}
