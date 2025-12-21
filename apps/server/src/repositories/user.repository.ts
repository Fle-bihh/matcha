import { BaseRepository } from "./base.repository";
import {
  AuthUser,
  CreateUserDto,
  logger,
  User,
  AuthUserWithPassword,
  PartialBaseEntity,
} from "@matcha/shared";
import { IContainer } from "@/types";

export class UserRepository extends BaseRepository {
  private readonly tableName = "users";

  constructor(container: IContainer) {
    super(container);

    this.initializeTable().catch((err) => {
      logger.error("Error initializing UserRepository table:", err);
    });
  }

  private async initializeTable(): Promise<void> {
    await this.createTableWithMetadata(
      this.tableName,
      `username VARCHAR(30) NOT NULL UNIQUE,
			 email VARCHAR(255) UNIQUE NOT NULL,
			 first_name VARCHAR(50) NOT NULL,
			 last_name VARCHAR(50) NOT NULL,
			 password VARCHAR(255) NOT NULL,
       is_email_verified BOOLEAN NOT NULL`
    );
  }

  public async createUser(data: CreateUserDto): Promise<AuthUserWithPassword> {
    const userWithPassword = await this.createDocument<AuthUserWithPassword>(
      this.tableName,
      {
        ...data,
        is_email_verified: false,
      }
    );
    return userWithPassword;
  }

  public async findUserById(
    userId: number
  ): Promise<AuthUserWithPassword | null> {
    try {
      const user = await this.getDoc<AuthUserWithPassword>(
        this.tableName,
        userId
      );
      return user;
    } catch (error) {
      logger.error("Error finding user by ID:", error);
      return null;
    }
  }

  public async findUserByEmail(
    email: string
  ): Promise<AuthUserWithPassword | null> {
    try {
      const users = await this.getDocs<AuthUserWithPassword>(this.tableName, {
        where: "email = ?",
        values: [email],
      });
      if (users.length === 0) {
        return null;
      }
      return users[0];
    } catch (error) {
      logger.error("Error finding user by email:", error);
      return null;
    }
  }

  public async findUserByUsername(
    username: string
  ): Promise<AuthUserWithPassword | null> {
    try {
      const users = await this.getDocs<AuthUserWithPassword>(this.tableName, {
        where: "username = ?",
        values: [username],
      });
      if (users.length === 0) {
        return null;
      }
      return users[0];
    } catch (error) {
      logger.error("Error finding user by username:", error);
      return null;
    }
  }

  public async updateUser(
    userId: number,
    data: PartialBaseEntity<AuthUser>
  ): Promise<AuthUserWithPassword | null> {
    try {
      const updatedUser = await this.updateDoc<AuthUserWithPassword>(
        this.tableName,
        userId,
        data
      );
      return updatedUser;
    } catch (error) {
      logger.error("Error updating user:", error);
      return null;
    }
  }

  public async updateUserPassword(
    userId: number,
    hashedPassword: string
  ): Promise<AuthUserWithPassword | null> {
    try {
      const updatedUser = await this.updateDoc<AuthUserWithPassword>(
        this.tableName,
        userId,
        { password: hashedPassword }
      );
      return updatedUser;
    } catch (error) {
      logger.error("Error updating user password:", error);
      return null;
    }
  }
}
