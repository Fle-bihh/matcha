import { BaseRepository } from "./BaseRepository";
import { CreateUser, User } from "@matcha/shared";
import { IContainer } from "@/types/container";

export class UserRepository extends BaseRepository {
	private readonly tableName = "users";

	constructor(container: IContainer) {
		super(container);
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
