import { IContainer } from "@/types";
import { Socket } from "socket.io-client";

export abstract class BaseHandler {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}

	protected get dispatch() {
		return this.container.store.dispatch;
	}

	public abstract register(socket: Socket): void;

	public abstract unregister(socket: Socket): void;
}
