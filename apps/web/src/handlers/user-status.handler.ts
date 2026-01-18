import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { EWebSocketEvents, UserStatusUpdateDto } from "@matcha/shared";
import { patchEntity } from "@/store";
import { EEntityTypes } from "@/types";

export class UserStatusHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(
			EWebSocketEvents.UserStatusUpdate,
			this.handleUserStatusUpdate,
		);
	}

	public unregister(socket: Socket): void {
		socket.off(
			EWebSocketEvents.UserStatusUpdate,
			this.handleUserStatusUpdate,
		);
	}

	private handleUserStatusUpdate = (dto: UserStatusUpdateDto): void => {
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Users,
				id: dto.userId.toString(),
				entity: { status: dto.status },
			}),
		);
	};
}
