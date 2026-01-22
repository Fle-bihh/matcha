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
	WebSocketEvents,
	NotificationType,
	getSystemMessageContent,
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

			const otherUserId =
				matchResponse.data.user1_id === senderId
					? matchResponse.data.user2_id
					: matchResponse.data.user1_id;

			const first_name =
				await this.userService.getUserFirstName(senderId);
			const notification = first_name
				? await this.notificationService.createNotification(
						otherUserId,
						NotificationType.MessageReceived,
						{
							sender_first_name: first_name,
							message_preview:
								content.slice(0, 25) +
								(content.length > 25 ? "..." : ""),
						},
					)
				: null;

			this.webSocketService.emitToUser(
				otherUserId,
				WebSocketEvents.MessageCreated,
				{
					message,
					notification,
				},
			);

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
		emitToUsers = false,
	): Promise<Message | null> {
		try {
			const message = await this.messageRepository.createSystemMessage(
				matchId,
				systemType,
				data,
			);

			if (emitToUsers && message) {
				const matchResponse =
					await this.matchService.getMatchById(matchId);

				if (this.isSuccess(matchResponse) && matchResponse.data) {
					const { user1_id, user2_id } = matchResponse.data;

					const user1Notification =
						await this.notificationService.createNotification(
							user1_id,
							NotificationType.MessageReceived,
							{
								message_preview:
									getSystemMessageContent(message),
							},
						);

					this.webSocketService.emitToUser(
						user1_id,
						WebSocketEvents.MessageCreated,
						{
							message,
							notification: user1Notification,
						},
					);

					this.webSocketService.emitToUser(
						user2_id,
						WebSocketEvents.MessageCreated,
						{
							message,
							notification: user1Notification,
						},
					);
				}
			}

			return message;
		} catch (error) {
			logger.error("Error creating system message:", error);
			return null;
		}
	}
}
