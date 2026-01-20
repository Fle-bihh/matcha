import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import { EWebSocketEvents } from "@matcha/shared";
import { incrementReceivedCount } from "@/store";

export class VisitHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.VisitCreated, this.handleNewVisit);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.VisitCreated, this.handleNewVisit);
	}

	private handleNewVisit = (): void => {
		this.dispatch(incrementReceivedCount());
		this.snackbar.success("Your profile was visited!");
	};
}
