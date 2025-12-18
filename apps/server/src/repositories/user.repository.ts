import { BaseRepository } from "./base.repository";
import {
	AuthUser,
	CreateUserDto,
	logger,
	User,
	AuthUserWithPassword,
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

	private excludePassword(userWithPassword: AuthUserWithPassword): AuthUser {
		const { password, ...userWithoutPassword } = userWithPassword;
		return userWithoutPassword;
	}

	public async createUser(data: CreateUserDto): Promise<AuthUser> {
		const userWithPassword =
			await this.createDocument<AuthUserWithPassword>(this.tableName, {
				...data,
				is_email_verified: false,
			});
		return this.excludePassword(userWithPassword);
	}

	public async findUserByEmail(
		email: string,
		withPassword?: boolean
	): Promise<AuthUser | null> {
		try {
			const users = await this.getDocs<AuthUserWithPassword>(
				this.tableName,
				{
					where: "email = ?",
					values: [email],
				}
			);
			return users.length > 0 ? this.excludePassword(users[0]) : null;
		} catch (error) {
			logger.error("Error finding user by email:", error);
			return null;
		}
	}

	public async findUserByEmailWithPassword(
		email: string
	): Promise<AuthUserWithPassword | null> {
		try {
			const users = await this.getDocs<AuthUserWithPassword>(
				this.tableName,
				{
					where: "email = ?",
					values: [email],
				}
			);
			return users.length > 0 ? users[0] : null;
		} catch (error) {
			logger.error("Error finding user by email with password:", error);
			return null;
		}
	}

	public async findUserByUsernameWithPassword(
		username: string
	): Promise<AuthUserWithPassword | null> {
		try {
			const users = await this.getDocs<AuthUserWithPassword>(
				this.tableName,
				{
					where: "username = ?",
					values: [username],
				}
			);
			return users.length > 0 ? users[0] : null;
		} catch (error) {
			logger.error(
				"Error finding user by username with password:",
				error
			);
			return null;
		}
	}

	public async findUserByUsername(
		username: string
	): Promise<AuthUser | null> {
		try {
			const users = await this.getDocs<AuthUserWithPassword>(
				this.tableName,
				{
					where: "username = ?",
					values: [username],
				}
			);
			return users.length > 0 ? this.excludePassword(users[0]) : null;
		} catch (error) {
			logger.error("Error finding user by username:", error);
			return null;
		}
	}
}
