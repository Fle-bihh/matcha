import { ServiceResponse } from "@/types/service.types";
import { IContainer, ETokens } from "@/types/container.types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories/user.repository";
import { User } from "@matcha/shared";
import { StatusCodes } from "http-status-codes";

export class UserService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	async initializeTable(): Promise<void> {
		await this.userRepository.initializeTable();
	}

	public async getAllUsers(): Promise<ServiceResponse<User[] | null>> {
		try {
			const users = await this.userRepository.getAllUsers();
			return ServiceResponse.success(
				"Users retrieved successfully",
				users
			);
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to retrieve users",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
