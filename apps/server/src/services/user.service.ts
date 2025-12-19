import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories";
import {
  AuthUserWithPassword,
  CreateUserDto,
  AuthUser,
  logger,
  UserResult,
  PartialBaseEntity,
} from "@matcha/shared";
import { StatusCodes } from "http-status-codes";

export class UserService extends BaseService {
  constructor(container: IContainer) {
    super(container);
  }

  private get userRepository(): UserRepository {
    return this.container.get<UserRepository>(ETokens.UserRepository);
  }

  private excludePassword(userWithPassword: AuthUserWithPassword): AuthUser {
    const { password, ...userWithoutPassword } = userWithPassword;
    return userWithoutPassword;
  }

  public async findByEmail<T extends boolean = false>(
    email: string,
    withPassword?: T
  ): Promise<ServiceResponse<UserResult<T>>> {
    try {
      const userWithPassword = await this.userRepository.findUserByEmail(email);
      if (!userWithPassword) {
        return ServiceResponse.success(
          "User not found",
          null
        ) as ServiceResponse<UserResult<T>>;
      }

      return ServiceResponse.success(
        "User found",
        withPassword ? userWithPassword : this.excludePassword(userWithPassword)
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
        return ServiceResponse.success(
          "User not found",
          null
        ) as ServiceResponse<UserResult<T>>;
      }

      return ServiceResponse.success(
        "User found",
        withPassword ? user : this.excludePassword(user)
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
        return ServiceResponse.success(
          "User not found",
          null
        ) as ServiceResponse<UserResult<T>>;
      }

      return ServiceResponse.success(
        "User found",
        withPassword ? user : this.excludePassword(user)
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

      return ServiceResponse.success(
        "User updated successfully",
        this.excludePassword(updatedUser)
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
}
