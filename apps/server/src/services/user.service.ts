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
  UpdateLocationDto,
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

      return ServiceResponse.success(
        "Password updated successfully",
        this.excludePassword(updatedUser)
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

  // this method ensures that profile pictures are organized without gaps, e.g., [pic1, null, pic3] -> [pic1, pic3]
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
        await this.cleanupUploadedFile(imageFile.path);
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const fileExtension = imageFile.originalname.split(".").pop() || "jpg";
      const timestamp = Date.now();
      const newFileName = `user-${userId}-pic-${index}-${timestamp}.${fileExtension}`;
      const path = `uploads/profile-pictures/${newFileName}`;

      const fs = await import("fs/promises");
      try {
        await fs.mkdir("uploads/profile-pictures", { recursive: true });
        await fs.rename(imageFile.path, path);
      } catch (moveError) {
        logger.error("Error moving file:", moveError);
        await this.cleanupUploadedFile(imageFile.path);
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
        await this.deleteOldPictureFile(picturesArray[index]);
      }

      picturesArray[index] = path;

      const updatedUser = await this.userRepository.updateUser(userId, {
        pictures_urls: this.reorganizeProfilePictures(picturesArray),
      });

      if (!updatedUser) {
        await this.cleanupUploadedFile(path);
        return ServiceResponse.failure(
          "Error updating profile picture",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      return ServiceResponse.success(
        "Profile picture updated successfully",
        this.excludePassword(updatedUser)
      );
    } catch (error) {
      logger.error("Error in uploadProfilePicture:", error);
      await this.cleanupUploadedFile(imageFile.path);
      return ServiceResponse.failure(
        "Error uploading profile picture",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async deleteOldPictureFile(urlPath: string): Promise<void> {
    try {
      const filePath = urlPath;
      const fs = await import("fs/promises");
      await fs.unlink(filePath);
      logger.info(`Deleted old picture file: ${filePath}`);
    } catch (error) {
      logger.warn(`Failed to delete old picture file ${urlPath}:`, error);
    }
  }

  private async cleanupUploadedFile(filePath: string): Promise<void> {
    try {
      const fs = await import("fs/promises");
      await fs.unlink(filePath);
      logger.info(`Cleaned up temporary file: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to cleanup file ${filePath}:`, error);
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

      return ServiceResponse.success(
        "Location updated successfully",
        this.excludePassword(updatedUser)
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
}
