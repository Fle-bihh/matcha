import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { WebSocketEvents, WebSocketEventDtoMap } from "@matcha/shared";
import { patchEntity } from "@/store";
import { EEntityTypes } from "@/types";

type LikeCreatedDto = WebSocketEventDtoMap[WebSocketEvents.LikeCreated];
type LikeDeletedDto = WebSocketEventDtoMap[WebSocketEvents.LikeDeleted];

export class LikeHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(WebSocketEvents.LikeCreated, this.handleLikeCreated);
		socket.on(WebSocketEvents.LikeDeleted, this.handleLikeDeleted);
	}

	public unregister(socket: Socket): void {
		socket.off(WebSocketEvents.LikeCreated, this.handleLikeCreated);
		socket.off(WebSocketEvents.LikeDeleted, this.handleLikeDeleted);
	}

	private handleLikeCreated = (dto: LikeCreatedDto): void => {
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Users,
				id: dto.liker_id.toString(),
				entity: { has_liked_you: true },
			}),
		);
		this.snackbar.success("You have a new like!");
	};

	private handleLikeDeleted = (dto: LikeDeletedDto): void => {
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Users,
				id: dto.liker_id.toString(),
				entity: { has_liked_you: false },
			}),
		);
	};
}
