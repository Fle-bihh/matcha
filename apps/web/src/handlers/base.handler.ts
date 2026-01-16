import { SnackbarService } from "@/services";
import { ETokens, IContainer } from "@/types";
import { Socket } from "socket.io-client";

export abstract class BaseHandler {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}

	protected get dispatch() {
		return this.container.store.dispatch;
	}

	protected get snackbar() {
		return this.container.get<SnackbarService>(ETokens.SnackbarService);
	}

	public abstract register(socket: Socket): void;

	public abstract unregister(socket: Socket): void;
}
