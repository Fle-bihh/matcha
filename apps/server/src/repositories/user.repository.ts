import { BaseRepository } from "./base.repository";
import {
	AuthUser,
	CreateUserDto,
	logger,
	User,
	AuthUserWithPassword,
	PartialBaseEntity,
	BrowsingFiltersDto,
} from "@matcha/shared";
import { ETokens, IContainer } from "@/types";
import { config } from "@/config";
import { HashUtils } from "@/utils/hash.utils";
import { generateRandomUsers } from "@/utils/seed-users.utils";
import { BrowsingRepository } from "./browsing.repository";

export class UserRepository extends BaseRepository {
	private readonly tableName = "users";

	constructor(container: IContainer) {
		super(container);

		this.initializeTable().catch((err) => {
			logger.error("Error initializing UserRepository table:", err);
		});
	}

	private get browsingRepository(): BrowsingRepository {
		return this.container.get<BrowsingRepository>(
			ETokens.BrowsingRepository
		);
	}

	public excludePassword(userWithPassword: AuthUserWithPassword): AuthUser {
		const { password, ...userWithoutPassword } = userWithPassword;
		return userWithoutPassword;
	}

	public excludePrivateFields(user: AuthUserWithPassword): User {
		const {
			password,
			email,
			is_email_verified,
			is_profile_complete,
			...publicUser
		} = user;
		return publicUser;
	}

	private readonly userInitialData = {
		is_email_verified: false,
		is_profile_complete: false,
		gender: null,
		orientation: null,
		age: null,
		bio: null,
		pictures_urls: [],
		interests: [],
		location: null,
		fame_score: 0,
	};

	private async initializeTable(): Promise<void> {
		await this.createTableWithMetadata(
			this.tableName,
			`username VARCHAR(30) NOT NULL UNIQUE,
			 email VARCHAR(255) UNIQUE NOT NULL,
			 first_name VARCHAR(50) NOT NULL,
			 last_name VARCHAR(50) NOT NULL,
			 password VARCHAR(255) NOT NULL,
       is_email_verified BOOLEAN NOT NULL,
       is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
       gender VARCHAR(20),
       orientation VARCHAR(20),
       age INTEGER,
       bio TEXT,
       pictures_urls JSON,
       interests JSON,
       location JSON,
       fame_score INTEGER NOT NULL DEFAULT 0`
		);

		await this.seedDatabaseIfEmpty();
	}

	private async seedDatabaseIfEmpty(): Promise<void> {
		try {
			const count = await this.countDocs(this.tableName);

			if (count === 0) {
				logger.info(
					"Database is empty. Seeding with 50 random users..."
				);
				const randomUsers = generateRandomUsers(50);

				for (const userData of randomUsers) {
					const hashedPassword = await HashUtils.hashPassword(
						userData.password
					);
					await this.createDocument<AuthUserWithPassword>(
						this.tableName,
						{
							...userData,
							password: hashedPassword,
						}
					);
				}

				logger.info("Successfully seeded database with 50 users");
			} else {
				logger.info(
					`Database already has ${count} users. Skipping seed.`
				);
			}
		} catch (error) {
			logger.error("Error seeding database:", error);
		}
	}

	private async sanitizeUserData(
		data: AuthUserWithPassword
	): Promise<AuthUserWithPassword> {
		return data;
	}

	public async createUser(
		data: CreateUserDto
	): Promise<AuthUserWithPassword> {
		const userWithPassword =
			await this.createDocument<AuthUserWithPassword>(this.tableName, {
				...data,
				...this.userInitialData,
			});
		return this.sanitizeUserData(userWithPassword);
	}

	public async findUserById(
		userId: number
	): Promise<AuthUserWithPassword | null> {
		try {
			const user = await this.getDoc<AuthUserWithPassword>(
				this.tableName,
				userId
			);
			return user ? this.sanitizeUserData(user) : null;
		} catch (error) {
			logger.error("Error finding user by ID:", error);
			return null;
		}
	}

	public async findUserByEmail(
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
			if (users.length === 0) {
				return null;
			}
			return users[0] ? this.sanitizeUserData(users[0]) : null;
		} catch (error) {
			logger.error("Error finding user by email:", error);
			return null;
		}
	}

	public async findUserByUsername(
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
			if (users.length === 0) {
				return null;
			}
			return users[0] ? this.sanitizeUserData(users[0]) : null;
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
			return updatedUser ? this.sanitizeUserData(updatedUser) : null;
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
			return updatedUser ? this.sanitizeUserData(updatedUser) : null;
		} catch (error) {
			logger.error("Error updating user password:", error);
			return null;
		}
	}

	public async getUsersForBrowsing(
		userId: number,
		limit: number,
		offset: number,
		filters: BrowsingFiltersDto
	): Promise<{ users: User[]; total: number }> {
		try {
			const queryOptions =
				await this.browsingRepository.getBrowsingQueryOptions(
					userId,
					limit,
					offset,
					filters
				);
			const [users, total] = await Promise.all([
				this.getDocs<User>(this.tableName, queryOptions),
				this.countDocs(this.tableName, {
					where: queryOptions.where,
					values: queryOptions.values,
				}),
			]);
			const sanitizedUsers = users.map((user) =>
				this.excludePrivateFields(user as AuthUserWithPassword)
			);
			return { users: sanitizedUsers, total };
		} catch (error) {
			logger.error("Error getting users:", error);
			return { users: [], total: 0 };
		}
	}
}
