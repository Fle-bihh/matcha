import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { EWebSocketEvents, LikeCreatedSocketDto } from "@matcha/shared";
import { patchEntity } from "@/store";
import { EEntityTypes } from "@/types";

export class LikeHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.LikeCreated, this.handleLikeCreated);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.LikeCreated, this.handleLikeCreated);
	}

	private handleLikeCreated = (dto: LikeCreatedSocketDto): void => {
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Users,
				id: dto.liker_id.toString(),
				entity: { has_liked_you: true },
			}),
		);
		this.snackbar.success("You have a new like!");
	};
}
