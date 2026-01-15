import { BaseRepository } from "./base.repository";
import { logger, PasswordReset } from "@matcha/shared";
import { IContainer } from "@/types";
import { IRepository, TableSchema } from "@/types/repository.types";

export class PasswordResetRepository
	extends BaseRepository
	implements IRepository
{
	private readonly tableName = "password_resets";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `user_id INT NOT NULL,
       reset_token VARCHAR(255) NOT NULL UNIQUE,
       is_used BOOLEAN NOT NULL DEFAULT FALSE,
       expires_at DATETIME NOT NULL`,
			constraints: `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`,
		};
	}

	public async createPasswordReset(
		userId: number,
		resetToken: string,
		expiresAt: Date
	): Promise<PasswordReset> {
		const reset = await this.createDocument<PasswordReset>(this.tableName, {
			user_id: userId,
			reset_token: resetToken,
			is_used: false,
			expires_at: expiresAt,
		});
		return reset;
	}

	public async findByToken(token: string): Promise<PasswordReset | null> {
		try {
			const resets = await this.getDocs<PasswordReset>(this.tableName, {
				where: "reset_token = ? AND is_used = FALSE AND expires_at > NOW()",
				values: [token],
				limit: 1,
			});
			return resets.length > 0 ? resets[0] : null;
		} catch (error) {
			logger.error("Error finding password reset by token:", error);
			return null;
		}
	}

	public async findLatestByUserId(
		userId: number
	): Promise<PasswordReset | null> {
		try {
			const resets = await this.getDocs<PasswordReset>(this.tableName, {
				where: "user_id = ? AND is_used = FALSE",
				values: [userId],
				orderBy: "created_at DESC",
				limit: 1,
			});
			return resets.length > 0 ? resets[0] : null;
		} catch (error) {
			logger.error("Error finding latest password reset:", error);
			return null;
		}
	}

	public async markAsUsed(id: number): Promise<boolean> {
		try {
			const result = await this.updateDoc<PasswordReset>(
				this.tableName,
				id,
				{
					is_used: true,
				}
			);
			return result !== null;
		} catch (error) {
			logger.error("Error marking password reset as used:", error);
			return false;
		}
	}

	public async deleteByUserId(userId: number): Promise<boolean> {
		try {
			const resets = await this.getDocs<PasswordReset>(this.tableName, {
				where: "user_id = ?",
				values: [userId],
			});

			for (const reset of resets) {
				await this.hardDeleteDoc(this.tableName, reset.id);
			}

			return true;
		} catch (error) {
			logger.error("Error deleting password resets by user ID:", error);
			return false;
		}
	}
}
