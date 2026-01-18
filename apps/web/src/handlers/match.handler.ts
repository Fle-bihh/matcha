import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import {
	EWebSocketEvents,
	IWebSocketEventDtoMap,
	logger,
} from "@matcha/shared";
import { deleteEntity, patchEntity, setEntity } from "@/store";
import { EEntityTypes, ETokens } from "@/types";
import { MatchService } from "@/services";

type MatchCreatedDto = IWebSocketEventDtoMap[EWebSocketEvents.MatchCreated];
type MatchDeletedDto = IWebSocketEventDtoMap[EWebSocketEvents.MatchDeleted];

export class MatchHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.MatchCreated, this.handleMatchCreated);
		socket.on(EWebSocketEvents.MatchDeleted, this.handleMatchDeleted);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.MatchCreated, this.handleMatchCreated);
		socket.off(EWebSocketEvents.MatchDeleted, this.handleMatchDeleted);
	}

	protected get matchService(): MatchService {
		return this.container.get<MatchService>(ETokens.MatchService);
	}

	private handleMatchCreated = (dto: MatchCreatedDto): void => {
		this.matchService.handleMatchWithDetails(dto);
		this.snackbar.success("You have a new match!");
	};

	private handleMatchDeleted = (dto: MatchDeletedDto): void => {
		this.dispatch(
			deleteEntity({
				entityType: EEntityTypes.Matches,
				id: dto.match_id.toString(),
			}),
		);
		if (dto.unlike_id) {
			this.dispatch(
				patchEntity({
					entityType: EEntityTypes.Users,
					id: dto.unlike_id.toString(),
					entity: { is_liked: false },
				}),
			);
		}
		if (dto.message) {
			this.snackbar.warning(dto.message);
		}
	};
}
