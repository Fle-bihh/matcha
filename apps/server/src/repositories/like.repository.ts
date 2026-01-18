import { BaseRepository } from "./base.repository";
import { Like, logger } from "@matcha/shared";
import { IContainer } from "@/types";
import { IRepository, TableSchema } from "@/types/repository.types";

export class LikeRepository extends BaseRepository implements IRepository {
	private readonly tableName = "likes";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				liker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				liked_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
			`,
			constraints: `CONSTRAINT no_self_like CHECK (liker_id != liked_id)`,
		};
	}

	public async createLike(
		likerId: number,
		likedId: number,
	): Promise<Like | null> {
		try {
			return await this.createDocument<Like>(this.tableName, {
				liker_id: likerId,
				liked_id: likedId,
			});
		} catch (error) {
			logger.error("Error creating like:", error);
			return null;
		}
	}

	public async getLikeByUsers(
		likerId: number,
		likedId: number,
	): Promise<Like | null> {
		try {
			const likes = await this.getDocs<Like>(this.tableName, {
				where: "liker_id = ? AND liked_id = ?",
				values: [likerId, likedId],
				limit: 1,
			});
			return likes[0] || null;
		} catch (error) {
			logger.error("Error fetching like:", error);
			return null;
		}
	}

	public async checkLikeExists(
		likerId: number,
		likedId: number,
	): Promise<boolean> {
		try {
			const like = await this.getLikeByUsers(likerId, likedId);
			return like !== null;
		} catch (error) {
			logger.error("Error checking like existence:", error);
			return false;
		}
	}

	public async checkReverseLikeExists(
		likerId: number,
		likedId: number,
	): Promise<boolean> {
		try {
			const reverseLike = await this.getLikeByUsers(likedId, likerId);
			return reverseLike !== null;
		} catch (error) {
			logger.error("Error checking reverse like:", error);
			return false;
		}
	}

	public async deleteLike(id: number): Promise<boolean> {
		try {
			const result = await this.deleteDoc(this.tableName, id);
			return result;
		} catch (error) {
			logger.error("Error deleting like:", error);
			return false;
		}
	}
}
