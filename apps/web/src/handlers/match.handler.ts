import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import {
	EWebSocketEvents,
	IWebSocketEventDtoMap,
	logger,
} from "@matcha/shared";
import { setEntity } from "@/store";
import { EEntityTypes } from "@/types";

type MatchCreatedDto = IWebSocketEventDtoMap[EWebSocketEvents.MatchCreated];

export class MatchHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.MatchCreated, this.handleMatchCreated);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.MatchCreated, this.handleMatchCreated);
	}

	private handleMatchCreated = (match: MatchCreatedDto): void => {
		this.dispatch(
			setEntity({
				entityType: EEntityTypes.Matches,
				id: match.id.toString(),
				entity: match,
			})
		);
	};
}
