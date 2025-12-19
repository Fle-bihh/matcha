import { BaseRepository } from "./base.repository";
import { EmailVerification, logger } from "@matcha/shared";
import { IContainer } from "@/types";

export class EmailVerificationRepository extends BaseRepository {
  private readonly tableName = "email_verifications";

  constructor(container: IContainer) {
    super(container);

    this.initializeTable().catch((err) => {
      logger.error(
        "Error initializing EmailVerificationRepository table:",
        err
      );
    });
  }

  private async initializeTable(): Promise<void> {
    await this.createTableWithMetadata(
      this.tableName,
      `user_id INT NOT NULL,
			 verification_token VARCHAR(255) NOT NULL UNIQUE,
			 is_used BOOLEAN NOT NULL DEFAULT FALSE,
			 expires_at DATETIME NOT NULL`,
      `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
    );
  }

  public async createVerification(
    userId: number,
    verificationToken: string,
    expiresAt: Date
  ): Promise<EmailVerification> {
    const verification = await this.createDocument<EmailVerification>(
      this.tableName,
      {
        user_id: userId,
        verification_token: verificationToken,
        is_used: false,
        expires_at: expiresAt,
      }
    );
    return verification;
  }

  public async findByToken(token: string): Promise<EmailVerification | null> {
    try {
      const verifications = await this.getDocs<EmailVerification>(
        this.tableName,
        {
          where:
            "verification_token = ? AND is_used = FALSE AND expires_at > NOW()",
          values: [token],
          limit: 1,
        }
      );
      return verifications.length > 0 ? verifications[0] : null;
    } catch (error) {
      logger.error("Error finding verification by token:", error);
      return null;
    }
  }

  public async markAsUsed(id: number): Promise<boolean> {
    try {
      const result = await this.updateDoc<EmailVerification>(
        this.tableName,
        id,
        {
          is_used: true,
        }
      );
      return result !== null;
    } catch (error) {
      logger.error("Error marking verification as used:", error);
      return false;
    }
  }

  public async deleteByUserId(userId: number): Promise<boolean> {
    try {
      const verifications = await this.getDocs<EmailVerification>(
        this.tableName,
        {
          where: "user_id = ?",
          values: [userId],
        }
      );

      for (const verification of verifications) {
        await this.hardDeleteDoc(this.tableName, verification.id);
      }

      return true;
    } catch (error) {
      logger.error("Error deleting verifications by user ID:", error);
      return false;
    }
  }
}
