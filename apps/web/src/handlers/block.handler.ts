import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { BlockCreatedSocketDto, EWebSocketEvents } from "@matcha/shared";
import { deleteEntity } from "@/store";
import { EEntityTypes } from "@/types";

export class BlockHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.BlockCreated, this.handleBlockCreated);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.BlockCreated, this.handleBlockCreated);
	}

	private handleBlockCreated = (dto: BlockCreatedSocketDto): void => {
		this.dispatch(
			deleteEntity({
				entityType: EEntityTypes.Users,
				id: dto.blocker_id.toString(),
			}),
		);
	};
}
