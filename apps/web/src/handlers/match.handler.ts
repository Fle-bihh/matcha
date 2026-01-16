import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import {
	EWebSocketEvents,
	IWebSocketEventDtoMap,
	logger,
} from "@matcha/shared";
import { deleteEntity, patchEntity, setEntity } from "@/store";
import { EEntityTypes } from "@/types";

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

	private handleMatchCreated = (dto: MatchCreatedDto): void => {
		this.dispatch(
			setEntity({
				entityType: EEntityTypes.Matches,
				id: dto.id.toString(),
				entity: dto,
			})
		);
		this.snackbar.success("You have a new match!");
	};

	private handleMatchDeleted = (dto: MatchDeletedDto): void => {
		this.dispatch(
			deleteEntity({
				entityType: EEntityTypes.Matches,
				id: dto.match_id.toString(),
			})
		);
		if (dto.unlike_id) {
			this.dispatch(
				patchEntity({
					entityType: EEntityTypes.Users,
					id: dto.unlike_id.toString(),
					entity: { isLiked: false },
				})
			);
		}
		if (dto.message) {
			this.snackbar.warning(dto.message);
		}
	};
}
