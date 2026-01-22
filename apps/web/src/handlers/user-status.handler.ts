import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { WebSocketEvents, WebSocketEventDtoMap } from "@matcha/shared";
import { patchEntity } from "@/store";
import { EEntityTypes } from "@/types";

type UserStatusUpdateDto =
	WebSocketEventDtoMap[WebSocketEvents.UserStatusUpdate];

export class UserStatusHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(
			WebSocketEvents.UserStatusUpdate,
			this.handleUserStatusUpdate,
		);
	}

	public unregister(socket: Socket): void {
		socket.off(
			WebSocketEvents.UserStatusUpdate,
			this.handleUserStatusUpdate,
		);
	}

	private handleUserStatusUpdate = (dto: UserStatusUpdateDto): void => {
		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Users,
				id: dto.user_id.toString(),
				entity: { status: dto.status },
			}),
		);
	};
}
