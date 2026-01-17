import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { EWebSocketEvents, UserStatusUpdateDto } from "@matcha/shared";

export class UserStatusHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(
			EWebSocketEvents.UserStatusUpdate,
			this.handleUserStatusUpdate
		);
	}

	public unregister(socket: Socket): void {
		socket.off(
			EWebSocketEvents.UserStatusUpdate,
			this.handleUserStatusUpdate
		);
	}

	private handleUserStatusUpdate = (dto: UserStatusUpdateDto): void => {
		this.snackbar.success("User status updated: " + JSON.stringify(dto));
	};
}
