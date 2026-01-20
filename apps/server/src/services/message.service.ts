import { ETokens, IContainer, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { MessageRepository } from "@/repositories";
import {
	CreateUserMessageDto,
	GetMessagesResponseDto,
	logger,
	Message,
	PaginationParams,
	StatusCodes,
	SystemMessageType,
	SystemMessageDataMap,
	CreateUserMessageResponseDto,
} from "@matcha/shared";

export class MessageService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get messageRepository(): MessageRepository {
		return this.container.get<MessageRepository>(ETokens.MessageRepository);
	}

	public async createUserMessage(
		senderId: number,
		data: CreateUserMessageDto,
	): Promise<ServiceResponse<CreateUserMessageResponseDto | null>> {
		try {
			const { match_id, content } = data;

			const matchResponse = await this.matchService.verifyUserInMatch(
				senderId,
				match_id,
			);

			if (!this.isSuccess(matchResponse) || !matchResponse.data) {
				return ServiceResponse.failure(
					matchResponse.message,
					null,
					matchResponse.statusCode,
				);
			}

			const message = await this.messageRepository.createUserMessage(
				matchResponse.data.id,
				senderId,
				content,
			);

			if (!message) {
				return ServiceResponse.failure(
					"Failed to send message",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success("Message sent successfully", {
				message,
			});
		} catch (error) {
			logger.error("Error creating user message:", error);
			return ServiceResponse.failure(
				"An error occurred while sending the message",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async getMessages(
		userId: number,
		matchId: number,
		pagination: PaginationParams,
	): Promise<ServiceResponse<GetMessagesResponseDto>> {
		try {
			const matchResponse = await this.matchService.verifyUserInMatch(
				userId,
				matchId,
			);

			if (!this.isSuccess(matchResponse) || !matchResponse.data) {
				return ServiceResponse.failure<GetMessagesResponseDto>(
					matchResponse.message,
					{
						messages: {
							data: [],
							meta: {
								page: pagination.page,
								limit: pagination.limit,
								total: 0,
								total_pages: 0,
								has_next_page: false,
								has_previous_page: false,
							},
						},
					},
					matchResponse.statusCode,
				);
			}

			const { page, limit } = pagination;
			const offset = (page - 1) * limit;

			const { messages, total } =
				await this.messageRepository.getMessages(
					matchResponse.data.id,
					limit,
					offset,
				);

			const totalPages = Math.ceil(total / limit);

			return ServiceResponse.success<GetMessagesResponseDto>(
				"Messages retrieved successfully",
				{
					messages: {
						data: messages,
						meta: {
							page,
							limit,
							total,
							total_pages: totalPages,
							has_next_page: page < totalPages,
							has_previous_page: page > 1,
						},
					},
				},
			);
		} catch (error) {
			logger.error("Error fetching messages:", error);
			return ServiceResponse.failure<GetMessagesResponseDto>(
				"An error occurred while fetching messages",
				{
					messages: {
						data: [],
						meta: {
							page: pagination.page,
							limit: pagination.limit,
							total: 0,
							total_pages: 0,
							has_next_page: false,
							has_previous_page: false,
						},
					},
				},
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async createSystemMessage<T extends SystemMessageType>(
		matchId: number,
		systemType: T,
		data: SystemMessageDataMap[T],
	): Promise<Message | null> {
		return this.messageRepository.createSystemMessage(
			matchId,
			systemType,
			data,
		);
	}
}
