import { IContainer } from "@/types";
import { BaseService } from "./base.service";
import { logger } from "@matcha/shared";
import { promises as fs } from "fs";
import { PROFILE_PICTURE_UPLOAD_PATH } from "@/middleware";

export class FileUploadService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	public async saveProfilePicture(
		userId: number,
		imageFile: Express.Multer.File,
		index: number,
	): Promise<string | null> {
		try {
			const fileExtension =
				imageFile.originalname.split(".").pop() || "jpg";
			const timestamp = Date.now();
			const newFileName = `user-${userId}-pic-${index}-${timestamp}.${fileExtension}`;
			const targetPath = `${PROFILE_PICTURE_UPLOAD_PATH}${newFileName}`;

			await fs.mkdir(PROFILE_PICTURE_UPLOAD_PATH, { recursive: true });
			await fs.rename(imageFile.path, targetPath);

			logger.info(`Saved profile picture: ${targetPath}`);
			return targetPath;
		} catch (error) {
			logger.error("Error saving profile picture:", error);
			await this.cleanupFile(imageFile.path);
			return null;
		}
	}

	public async deleteFile(filePath: string): Promise<void> {
		try {
			await fs.unlink(filePath);
			logger.info(`Deleted file: ${filePath}`);
		} catch (error) {
			logger.warn(`Failed to delete file ${filePath}:`, error);
		}
	}

	public async cleanupFile(filePath: string): Promise<void> {
		try {
			await fs.unlink(filePath);
			logger.info(`Cleaned up temporary file: ${filePath}`);
		} catch (error) {
			logger.error(`Failed to cleanup file ${filePath}:`, error);
		}
	}
}
