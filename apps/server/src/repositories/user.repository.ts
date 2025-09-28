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
			`username VARCHAR(30) NOT NULL UNIQUE`
		);

		const count = await this.countDocs(this.tableName);
		if (count === 0) {
			await this.createUser({ username: "alice" });
			await this.createUser({ username: "bob" });
		}
	}

	private async createUser(data: CreateUser): Promise<void> {
		await this.createDocument<CreateUser>(this.tableName, data);
	}

	public async getAllUsers(): Promise<User[]> {
		return await this.getDocs<User>(this.tableName);
	}
}
