import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { WebSocketEvents, WebSocketEventDtoMap } from "@matcha/shared";
import { patchEntity } from "@/store";
import { EEntityTypes } from "@/types";

type MessageCreatedDto = WebSocketEventDtoMap[WebSocketEvents.MessageCreated];

export class MessageHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(WebSocketEvents.MessageCreated, this.handleNewMessage);
	}

	public unregister(socket: Socket): void {
		socket.off(WebSocketEvents.MessageCreated, this.handleNewMessage);
	}

	private handleNewMessage = (dto: MessageCreatedDto): void => {
		const { message } = dto;
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Messages,
				id: message.id.toString(),
				entity: message,
			}),
		);
	};
}
