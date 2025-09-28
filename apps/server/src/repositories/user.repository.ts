import { BaseRepository } from "./base.repository";
import { CreateUser, logger, User } from "@matcha/shared";
import { IContainer } from "@/types";

export class UserRepository extends BaseRepository {
	private readonly tableName = "users";

	constructor(container: IContainer) {
		super(container);

		this.initializeTable().catch((err) => {
			logger.error("Error initializing UserRepository table:", err);
		});
	}

	async initializeTable(): Promise<void> {
		await this.createTableWithMetadata(
			this.tableName,
			`username VARCHAR(30) NOT NULL UNIQUE,
			 email VARCHAR(255) UNIQUE NOT NULL,
			 password VARCHAR(255) NOT NULL`
		);
	}

	public async createUser(data: CreateUser): Promise<User> {
		return await this.createDocument<User>(this.tableName, data);
	}

	public async getAllUsers(): Promise<User[]> {
		return await this.getDocs<User>(this.tableName);
	}

	public async findUserByEmail(email: string): Promise<User | null> {
		try {
			const users = await this.getDocs<User>(this.tableName, {
				where: "email = ?",
				values: [email],
			});
			return users.length > 0 ? users[0] : null;
		} catch (error) {
			logger.error("Error finding user by email:", error);
			return null;
		}
	}
}
