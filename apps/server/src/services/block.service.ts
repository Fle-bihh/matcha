import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { BlockRepository } from "@/repositories";
import {
	CreateBlockDto,
	EWebSocketEvents,
	StatusCodes,
	logger,
} from "@matcha/shared";

export class BlockService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get blockRepository(): BlockRepository {
		return this.container.get<BlockRepository>(ETokens.BlockRepository);
	}

	public async checkBlockExists(
		userIdA: number,
		UserIdB: number,
	): Promise<boolean> {
		const aBlockedB = await this.blockRepository.checkBlockExists(
			userIdA,
			UserIdB,
		);
		const bBlockedA = await this.blockRepository.checkBlockExists(
			UserIdB,
			userIdA,
		);
		return aBlockedB || bBlockedA;
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

			const cleanupResponse =
				await this.likeService.deleteAllLikesBetweenUsers(
					blockerId,
					blocked_id,
					"A match was canceled.",
				);

			if (!this.isSuccess(cleanupResponse)) {
				return ServiceResponse.failure(
					"Failed to clean up likes and matches",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
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

			this.webSocketService.emitToUser(
				blocked_id,
				EWebSocketEvents.BlockCreated,
				{
					blocker_id: blockerId,
				},
			);

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
