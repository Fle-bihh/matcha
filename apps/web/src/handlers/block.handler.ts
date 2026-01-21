import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { WebSocketEventDtoMap, WebSocketEvents } from "@matcha/shared";
import { deleteEntity } from "@/store";
import { EEntityTypes } from "@/types";

type BlockCreatedDto = WebSocketEventDtoMap[WebSocketEvents.BlockCreated];

export class BlockHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(WebSocketEvents.BlockCreated, this.handleBlockCreated);
	}

	public unregister(socket: Socket): void {
		socket.off(WebSocketEvents.BlockCreated, this.handleBlockCreated);
	}

	private handleBlockCreated = (dto: BlockCreatedDto): void => {
		this.dispatch(
			deleteEntity({
				entityType: EEntityTypes.Users,
				id: dto.blocker_id.toString(),
			}),
		);
	};
}
