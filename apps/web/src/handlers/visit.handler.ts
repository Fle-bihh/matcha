import { BaseHandler } from "./base.handler";
import { Socket } from "socket.io-client";
import {
	EWebSocketEvents,
	IWebSocketEventDtoMap,
	logger,
} from "@matcha/shared";
import { deleteEntity, patchEntity, setEntity } from "@/store";
import { incrementReceivedCount } from "@/store/slices/visits.slice";
import { EEntityTypes } from "@/types";

export class VisitHandler extends BaseHandler {
	public register(socket: Socket): void {
		socket.on(EWebSocketEvents.NewVisit, this.handleNewVisit);
	}

	public unregister(socket: Socket): void {
		socket.off(EWebSocketEvents.NewVisit, this.handleNewVisit);
	}

	private handleNewVisit = (): void => {
		this.dispatch(incrementReceivedCount());
		this.snackbar.success("Your profile was visited!");
	};
}
