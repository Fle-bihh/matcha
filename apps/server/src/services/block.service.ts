import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { BlockRepository } from "@/repositories";
import { CreateBlockDto, StatusCodes, logger } from "@matcha/shared";

export class BlockService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	public async checkBlockExists(
		blockerId: number,
		blockedId: number,
	): Promise<boolean> {
		return this.blockRepository.checkBlockExists(blockerId, blockedId);
	}

	public async createBlock(
		blockerId: number,
		data: CreateBlockDto,
	): Promise<ServiceResponse> {
		try {
			const { blocked_id } = data;

			if (blockerId === blocked_id) {
				return ServiceResponse.failure(
					"You cannot block yourself",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const existingBlock = await this.blockRepository.checkBlockExists(
				blockerId,
				blocked_id,
			);

			if (existingBlock) {
				return ServiceResponse.failure(
					"You have already blocked this user",
					null,
					StatusCodes.CONFLICT,
				);
			}

			const block = await this.blockRepository.createBlock(
				blockerId,
				blocked_id,
			);

			if (!block) {
				return ServiceResponse.failure(
					"Failed to create block",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				"Block created successfully",
				null,
				StatusCodes.CREATED,
			);
		} catch (error) {
			logger.error("Error in createBlock:", error);
			return ServiceResponse.failure(
				"An error occurred while creating the block",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
