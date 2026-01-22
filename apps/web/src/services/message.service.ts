import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	CreateUserMessageDto,
	CreateUserMessageResponseDto,
	GetMessagesResponseDto,
	Message,
} from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import type { PaginationDto } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys, getMessagesPagerKey } from "@/constants";
import {
	clearPager,
	deleteEntities,
	selectMessagesByMatchId,
	setEntity,
} from "@/store";

export class MessageService extends BaseService {
	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getMessages(
		params: { matchId: string } & PaginationDto,
	): Promise<ServiceResponse> {
		const { matchId, ...paginationParams } = params;

		const response = await this.apiService.get<GetMessagesResponseDto>(
			getRoute(ERouteGroups.Message, "get-messages").replace(
				":id",
				matchId,
			),
			{ auth: true, params: paginationParams },
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		const messages = response.data.messages;

		this.handlePaginatedResponse(
			{ data: messages.data, meta: messages.meta },
			getMessagesPagerKey(matchId),
			EEntityTypes.Messages,
			params?.refresh !== true,
		);

		return ServiceResponse.success(response.message);
	}

	@action({ showSuccessMessage: false, showErrorMessage: true })
	async createMessage(dto: CreateUserMessageDto): Promise<ServiceResponse> {
		const response =
			await this.apiService.post<CreateUserMessageResponseDto>(
				getRoute(ERouteGroups.Message, "create-message"),
				dto,
				{ auth: true },
			);

		if (this.isSuccess(response)) {
			this.dispatch(
				setEntity({
					entityType: EEntityTypes.Messages,
					entity: response.data.message,
					id: response.data.message.id.toString(),
				}),
			);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	public async deleteMessagesByMatchId(matchId: number): Promise<void> {
		this.dispatch(clearPager(getMessagesPagerKey(matchId.toString())));
		const state = this.container.store.getState();
		const messagesIds = selectMessagesByMatchId(matchId.toString())(
			state,
		).map((message: Message) => message.id.toString());
		this.dispatch(
			deleteEntities({
				entityType: EEntityTypes.Messages,
				ids: messagesIds,
			}),
		);
	}
}
