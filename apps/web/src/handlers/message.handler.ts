import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { EWebSocketEvents, MessageCreatedSocketDto } from "@matcha/shared";
import { patchEntity } from "@/store";
import { EEntityTypes } from "@/types";

export class MessageHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.MessageCreated, this.handleNewMessage);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.MessageCreated, this.handleNewMessage);
	}

	private handleNewMessage = (dto: MessageCreatedSocketDto): void => {
		const { message } = dto;
		console.log("Received new message via WebSocket:", message);
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Messages,
				id: message.id.toString(),
				entity: message,
			}),
		);
	};
}
