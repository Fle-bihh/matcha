import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { WebSocketEventDtoMap, WebSocketEvents } from "@matcha/shared";
import { incrementReceivedCount } from "@/store";

type VisitCreatedDto = WebSocketEventDtoMap[WebSocketEvents.VisitCreated];

export class VisitHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(WebSocketEvents.VisitCreated, this.handleNewVisit);
	}

	public unregister(socket: Socket): void {
		socket.off(WebSocketEvents.VisitCreated, this.handleNewVisit);
	}

	private handleNewVisit = (dto: VisitCreatedDto): void => {
		const {} = dto;
		this.dispatch(incrementReceivedCount());
	};
}
