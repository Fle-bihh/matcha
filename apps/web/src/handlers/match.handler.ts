import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { WebSocketEvents, WebSocketEventDtoMap } from "@matcha/shared";
import { deleteEntity, patchEntity } from "@/store";
import { EEntityTypes, ETokens } from "@/types";
import { MatchService, MessageService } from "@/services";

type MatchCreatedDto = WebSocketEventDtoMap[WebSocketEvents.MatchCreated];
type MatchDeletedDto = WebSocketEventDtoMap[WebSocketEvents.MatchDeleted];

export class MatchHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(WebSocketEvents.MatchCreated, this.handleMatchCreated);
		socket.on(WebSocketEvents.MatchDeleted, this.handleMatchDeleted);
	}

	public unregister(socket: Socket): void {
		socket.off(WebSocketEvents.MatchCreated, this.handleMatchCreated);
		socket.off(WebSocketEvents.MatchDeleted, this.handleMatchDeleted);
	}

	protected get matchService(): MatchService {
		return this.container.get<MatchService>(ETokens.MatchService);
	}

	protected get messageService(): MessageService {
		return this.container.get<MessageService>(ETokens.MessageService);
	}

	private handleMatchCreated = (dto: MatchCreatedDto): void => {
		this.matchService.handleMatchWithDetails(dto);
	};

	private handleMatchDeleted = (dto: MatchDeletedDto): void => {
		this.dispatch(
			deleteEntity({
				entityType: EEntityTypes.Matches,
				id: dto.match_id.toString(),
			}),
		);

		this.messageService.deleteMessagesByMatchId(dto.match_id);

		if (dto.unlike_id) {
			const newEntity = {
				is_liked: false,
				is_matched: false,
				has_liked_you: false,
			};

			this.dispatch(
				patchEntity({
					entityType: EEntityTypes.Users,
					id: dto.unlike_id.toString(),
					entity: newEntity,
				}),
			);
		}
	};
}
