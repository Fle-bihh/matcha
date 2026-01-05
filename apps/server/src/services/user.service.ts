import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories";
import { UserDeletionService } from "./user-deletion.service";
import {
	AuthUserWithPassword,
	CreateUserDto,
	AuthUser,
	logger,
	UserResult,
	PartialBaseEntity,
	UpdateLocationDto,
	PaginationParams,
	PaginatedResponse,
	User,
	BrowsingFilters,
	BrowsingFiltersDto,
} from "@matcha/shared";
import { StatusCodes } from "http-status-codes";
import { HashUtils } from "@/utils/hash.utils";

export class UserService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	private get userDeletionService(): UserDeletionService {
		return this.container.get<UserDeletionService>(
			ETokens.UserDeletionService
		);
	}

	public async findByEmail<T extends boolean = false>(
		email: string,
		withPassword?: T
	): Promise<ServiceResponse<UserResult<T>>> {
		try {
			const userWithPassword = await this.userRepository.findUserByEmail(
				email
			);
			if (!userWithPassword) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				) as ServiceResponse<UserResult<T>>;
			}

			return ServiceResponse.success(
				"User found",
				withPassword
					? userWithPassword
					: this.userRepository.excludePassword(userWithPassword)
			) as ServiceResponse<UserResult<T>>;
		} catch (error) {
			return ServiceResponse.failure(
				"Error finding user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async findByUsername<T extends boolean = false>(
		username: string,
		withPassword?: T
	): Promise<ServiceResponse<UserResult<T>>> {
		try {
			const user = await this.userRepository.findUserByUsername(username);
			if (!user) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				) as ServiceResponse<UserResult<T>>;
			}

			return ServiceResponse.success(
				"User found",
				withPassword ? user : this.userRepository.excludePassword(user)
			) as ServiceResponse<UserResult<T>>;
		} catch (error) {
			return ServiceResponse.failure(
				"Error finding user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async findById<T extends boolean = false>(
		userId: number,
		withPassword?: T
	): Promise<ServiceResponse<UserResult<T>>> {
		try {
			const user = await this.userRepository.findUserById(userId);
			if (!user) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			return ServiceResponse.success(
				"User found",
				withPassword ? user : this.userRepository.excludePassword(user)
			) as ServiceResponse<UserResult<T>>;
		} catch (error) {
			return ServiceResponse.failure(
				"Error finding user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async createUser(
		userData: CreateUserDto
	): Promise<ServiceResponse<AuthUser | null>> {
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
			logger.error("Error in createUser:", error);
			return ServiceResponse.failure(
				"Error creating user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	private async mayberCompleteUserProfile(
		user: AuthUserWithPassword
	): Promise<AuthUserWithPassword> {
		const requiredFields: (keyof AuthUser)[] = [
			"first_name",
			"last_name",
			"gender",
			"bio",
			"age",
			"orientation",
		];

		for (const field of requiredFields) {
			const value = user[field];
			if (
				value === null ||
				value === undefined ||
				(typeof value === "string" && value.trim() === "")
			) {
				return user;
			}
		}

		if (!user.pictures_urls || user.pictures_urls.length === 0) {
			return user;
		}

		if (!user.interests || user.interests.length === 0) {
			return user;
		}

		if (!user.location) {
			return user;
		}
		const updatedUser = await this.userRepository.updateUser(user.id, {
			is_profile_complete: true,
		});

		return updatedUser || user;
	}

	public async updateUser(
		userId: number,
		userData: PartialBaseEntity<AuthUser>
	): Promise<ServiceResponse<AuthUser | null>> {
		try {
			const updatedUser = await this.userRepository.updateUser(
				userId,
				userData
			);

			if (!updatedUser) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			const completedUser = await this.mayberCompleteUserProfile(
				updatedUser
			);

			return ServiceResponse.success(
				"User updated successfully",
				this.userRepository.excludePassword(completedUser)
			);
		} catch (error) {
			logger.error("Error in updateUser:", error);
			return ServiceResponse.failure(
				"Error updating user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async updateUserPassword(
		userId: number,
		newPassword: string
	): Promise<ServiceResponse<AuthUser | null>> {
		try {
			const user = await this.userRepository.findUserById(userId);
			if (!user) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			if (await HashUtils.comparePassword(newPassword, user.password)) {
				return ServiceResponse.failure(
					"New password cannot be the same as the old password",
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const hashedPassword = await HashUtils.hashPassword(newPassword);

			const updatedUser = await this.userRepository.updateUserPassword(
				userId,
				hashedPassword
			);

			if (!updatedUser) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			const completedUser = await this.mayberCompleteUserProfile(
				updatedUser
			);

			return ServiceResponse.success(
				"Password updated successfully",
				this.userRepository.excludePassword(completedUser)
			);
		} catch (error) {
			logger.error("Error in updateUserPassword:", error);
			return ServiceResponse.failure(
				"Error updating password",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	private reorganizeProfilePictures(pictures: (string | null)[]): string[] {
		const organizedPictures: string[] = [];
		for (const pic of pictures) {
			if (pic) {
				organizedPictures.push(pic);
			}
		}
		return organizedPictures;
	}

	public async updateProfilePicture(
		userId: number,
		imageFile: Express.Multer.File,
		index: number
	): Promise<ServiceResponse<AuthUser | null>> {
		try {
			const user = await this.userRepository.findUserById(userId);
			if (!user) {
				await this.fileUploadService.cleanupFile(imageFile.path);
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			const path = await this.fileUploadService.saveProfilePicture(
				userId,
				imageFile,
				index
			);

			if (!path) {
				return ServiceResponse.failure(
					"Error saving profile picture",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}

			const picturesArray = Array.isArray(user.pictures_urls)
				? [...user.pictures_urls]
				: [];

			if (picturesArray[index]) {
				await this.fileUploadService.deleteFile(picturesArray[index]);
			}

			picturesArray[index] = path;

			const updatedUser = await this.userRepository.updateUser(userId, {
				pictures_urls: this.reorganizeProfilePictures(picturesArray),
			});

			if (!updatedUser) {
				await this.fileUploadService.deleteFile(path);
				return ServiceResponse.failure(
					"Error updating profile picture",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			const completedUser = await this.mayberCompleteUserProfile(
				updatedUser
			);

			return ServiceResponse.success(
				"Profile picture updated successfully",
				this.userRepository.excludePassword(completedUser)
			);
		} catch (error) {
			logger.error("Error in uploadProfilePicture:", error);
			await this.fileUploadService.cleanupFile(imageFile.path);
			return ServiceResponse.failure(
				"Error uploading profile picture",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async updateLocation(
		userId: number,
		dto: UpdateLocationDto
	): Promise<ServiceResponse<AuthUser | null>> {
		try {
			const locationData = dto;
			const user = await this.userRepository.findUserById(userId);
			if (!user) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}

			const updatedUser = await this.userRepository.updateUser(userId, {
				location: locationData,
			});

			if (!updatedUser) {
				return ServiceResponse.failure(
					"Failed to update location",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}

			const completedUser = await this.mayberCompleteUserProfile(
				updatedUser
			);

			return ServiceResponse.success(
				"Location updated successfully",
				this.userRepository.excludePassword(completedUser)
			);
		} catch (error) {
			logger.error("Error in updateLocation:", error);
			return ServiceResponse.failure(
				"Error updating location",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getUsers(
		userId: number,
		paginationParams: PaginationParams,
		browsingFilters: BrowsingFiltersDto
	): Promise<ServiceResponse<PaginatedResponse<User>>> {
		try {
			const { page, limit } = paginationParams;
			const offset = (page - 1) * limit;

			const { users, total } =
				await this.userRepository.getUsersForBrowsing(
					userId,
					paginationParams.limit,
					offset,
					browsingFilters
				);

			const totalPages = Math.ceil(total / paginationParams.limit);

			const paginatedResponse: PaginatedResponse<User> = {
				data: users,
				meta: {
					page: paginationParams.page,
					limit: paginationParams.limit,
					total,
					totalPages,
					hasNextPage: paginationParams.page < totalPages,
					hasPreviousPage: paginationParams.page > 1,
				},
			};

			return ServiceResponse.success(
				"Users retrieved successfully",
				paginatedResponse
			);
		} catch (error) {
			logger.error("Error in getUsers:", error);
			return ServiceResponse.failure(
				"Error retrieving users",
				{
					data: [],
					meta: {
						page: 1,
						limit: 20,
						total: 0,
						totalPages: 0,
						hasNextPage: false,
						hasPreviousPage: false,
					},
				},
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async deleteUser(userId: number): Promise<ServiceResponse<null>> {
		try {
			const success =
				await this.userDeletionService.deleteUserAndRelatedData(userId);

			if (!success) {
				return ServiceResponse.failure(
					"Failed to delete user",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}

			return ServiceResponse.success("User deleted successfully", null);
		} catch (error) {
			logger.error("Error deleting user:", error);
			return ServiceResponse.failure(
				"Error deleting user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async restoreUser(userId: number): Promise<ServiceResponse<null>> {
		try {
			const success =
				await this.userDeletionService.restoreUserAndRelatedData(
					userId
				);

			if (!success) {
				return ServiceResponse.failure(
					"Failed to restore user",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}

			return ServiceResponse.success("User restored successfully", null);
		} catch (error) {
			logger.error("Error restoring user:", error);
			return ServiceResponse.failure(
				"Error restoring user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
