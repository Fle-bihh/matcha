import { BaseRepository } from "./base.repository";
import {
	AuthUser,
	CreateUser,
	logger,
	User,
	UserWithPassword,
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
			 password VARCHAR(255) NOT NULL`
		);
	}

	public async createUser(data: CreateUser): Promise<AuthUser> {
		const userWithPassword = await this.createDocument<UserWithPassword>(
			this.tableName,
			data
		);
		return this.excludePassword(userWithPassword);
	}

	public async findUserByEmail(email: string): Promise<AuthUser | null> {
		try {
			const users = await this.getDocs<UserWithPassword>(this.tableName, {
				where: "email = ?",
				values: [email],
			});
			return users.length > 0 ? this.excludePassword(users[0]) : null;
		} catch (error) {
			logger.error("Error finding user by email:", error);
			return null;
		}
	}

	public async findUserByEmailWithPassword(
		email: string
	): Promise<UserWithPassword | null> {
		try {
			const users = await this.getDocs<UserWithPassword>(this.tableName, {
				where: "email = ?",
				values: [email],
			});
			return users.length > 0 ? users[0] : null;
		} catch (error) {
			logger.error("Error finding user by email with password:", error);
			return null;
		}
	}

	private excludePassword(userWithPassword: UserWithPassword): AuthUser {
		const { password, ...userWithoutPassword } = userWithPassword;
		return userWithoutPassword;
	}
}
