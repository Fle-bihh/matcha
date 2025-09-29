import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories";
import { User, UserWithPassword, CreateUser } from "@matcha/shared";
import { StatusCodes } from "http-status-codes";

export class UserService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	public async findByEmail(
		email: string
	): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findUserByEmail(email);
			return ServiceResponse.success("User found", user);
		} catch (error) {
			return ServiceResponse.failure(
				"Error finding user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async findByEmailWithPassword(
		email: string
	): Promise<ServiceResponse<UserWithPassword | null>> {
		try {
			const user = await this.userRepository.findUserByEmailWithPassword(
				email
			);
			return ServiceResponse.success("User found", user);
		} catch (error) {
			return ServiceResponse.failure(
				"Error finding user with password",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async findById(
		userId: string
	): Promise<ServiceResponse<User | null>> {
		try {
			const users = await this.userRepository.getDocs<UserWithPassword>(
				"users",
				{
					where: "id = ?",
					values: [userId],
				}
			);

			if (!users || users.length === 0) {
				return ServiceResponse.success("User not found", null);
			}

			const { password: _, ...user } = users[0];
			return ServiceResponse.success("User found", user);
		} catch (error) {
			return ServiceResponse.failure(
				"Error finding user by ID",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async createUser(
		userData: CreateUser
	): Promise<ServiceResponse<User | null>> {
		try {
			const existingUser = await this.userRepository.findUserByEmail(
				userData.email
			);

			if (existingUser) {
				return ServiceResponse.failure(
					"Email already in use",
					null,
					StatusCodes.CONFLICT
				);
			}

			const user = await this.userRepository.createUser(userData);
			return ServiceResponse.success("User created successfully", user);
		} catch (error) {
			return ServiceResponse.failure(
				"Error creating user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getAllUsers(): Promise<ServiceResponse<User[]>> {
		try {
			const users = await this.userRepository.getAllUsers();
			return ServiceResponse.success(
				"Users retrieved successfully",
				users
			);
		} catch (error) {
			return ServiceResponse.failure(
				"Error retrieving users",
				[],
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
