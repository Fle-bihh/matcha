import { io, Socket } from "socket.io-client";
import { BaseService } from "./base.service";
import { EStorageKeys } from "@/types";
import {
	logger,
	EWebSocketEvents,
	IWebSocketEventDtoMap,
} from "@matcha/shared";
import { config } from "@/config";
import { IContainer } from "@/types";
import {
	BaseHandler,
	LikeHandler,
	MatchHandler,
	UserStatusHandler,
	VisitHandler,
} from "@/handlers";

export class WebSocketService extends BaseService {
	private socket: Socket | null = null;
	private isConnected: boolean = false;
	private handlers: BaseHandler[];

	constructor(container: IContainer) {
		super(container);
		this.handlers = [
			new MatchHandler(container),
			new VisitHandler(container),
			new UserStatusHandler(container),
			new LikeHandler(container),
		];
	}

	public async connect(): Promise<void> {
		if (this.socket?.connected) {
			logger.debug("WebSocket already connected");
			return;
		}

		const token = await this.storageService.getItem(
			EStorageKeys.AccessToken,
		);

		if (!token) {
			logger.warn("No access token found, cannot connect to WebSocket");
			return;
		}

		const serverUrl = config.apiUrl.replace("/api/v1", "");

		this.socket = io(serverUrl, {
			auth: { token },
			autoConnect: true,
		});

		this.setupEventHandlers();
	}

	private setupEventHandlers(): void {
		if (!this.socket) return;

		this.socket.on(EWebSocketEvents.Connect, () => {
			this.isConnected = true;
			logger.info("WebSocket connected");
		});

		this.socket.on(EWebSocketEvents.Disconnect, (reason) => {
			this.isConnected = false;
			if (reason !== "io server disconnect") {
				logger.info(`WebSocket disconnected: ${reason}`);
			}
		});

		this.handlers.forEach((handler) => {
			handler.register(this.socket!);
		});

		this.socket.on("connect_error", (error: Error) => {
			if (!error.message.includes("xhr poll error")) {
				logger.error("WebSocket connection error:", error);
			}
		});
	}

	public disconnect(): void {
		if (this.socket) {
			this.handlers.forEach((handler) =>
				handler.unregister(this.socket!),
			);
			this.socket.disconnect();
			this.socket = null;
			this.isConnected = false;
			logger.info("WebSocket disconnected manually");
		}
	}

	public on<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		callback: (data: IWebSocketEventDtoMap[K]) => void,
	): void {
		if (this.socket) {
			this.socket.on(event as string, callback);
		}
	}

	public off<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		callback?: (data: IWebSocketEventDtoMap[K]) => void,
	): void {
		if (this.socket) {
			this.socket.off(event as string, callback);
		}
	}

	public emit<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		data: IWebSocketEventDtoMap[K],
	): void {
		if (this.socket?.connected) {
			this.socket.emit(event as string, data);
		}
	}

	public getConnectionStatus(): boolean {
		return this.isConnected;
	}
}
