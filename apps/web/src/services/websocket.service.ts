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
	private handlers: BaseHandler[];
	private readyPromise: Promise<void> | null = null;

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
			return;
		}

		if (this.readyPromise) {
			return this.readyPromise;
		}

		const token = await this.storageService.getItem(
			EStorageKeys.AccessToken,
		);

		if (!token) {
			throw new Error("No access token available");
		}

		const serverUrl = config.apiUrl.replace("/api/v1", "");

		this.socket = io(serverUrl, {
			auth: { token },
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			timeout: 20000,
		});

		this.readyPromise = new Promise((resolve, reject) => {
			const onConnect = () => {
				cleanup();
				logger.info("WebSocket connected");
				resolve();
			};

			const onError = (error: Error) => {
				cleanup();
				logger.error("WebSocket connection failed:", error);
				reject(error);
			};

			const cleanup = () => {
				this.socket?.off(EWebSocketEvents.Connect, onConnect);
				this.socket?.off("connect_error", onError);
			};

			this.socket?.once(EWebSocketEvents.Connect, onConnect);
			this.socket?.once("connect_error", onError);
		});

		this.setupEventHandlers();

		return this.readyPromise;
	}

	private setupEventHandlers(): void {
		if (!this.socket) return;

		this.socket.on(EWebSocketEvents.Disconnect, (reason) => {
			logger.info(`WebSocket disconnected: ${reason}`);
			this.readyPromise = null;
		});

		this.handlers.forEach((handler) => {
			handler.register(this.socket!);
		});
	}

	public disconnect(): void {
		if (this.socket) {
			this.handlers.forEach((handler) =>
				handler.unregister(this.socket!),
			);
			this.socket.disconnect();
			this.socket = null;
			this.readyPromise = null;
		}
	}

	public async on<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		callback: (data: IWebSocketEventDtoMap[K]) => void,
	): Promise<void> {
		await this.ensureReady();
		this.socket!.on(event as string, callback);
	}

	public async off<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		callback?: (data: IWebSocketEventDtoMap[K]) => void,
	): Promise<void> {
		await this.ensureReady();
		this.socket!.off(event as string, callback);
	}

	public async emit<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		data: IWebSocketEventDtoMap[K],
	): Promise<void> {
		await this.ensureReady();
		this.socket!.emit(event as string, data);
	}

	public isConnected(): boolean {
		return this.socket?.connected ?? false;
	}

	private async ensureReady(): Promise<void> {
		if (this.socket?.connected) {
			return;
		}

		if (this.readyPromise) {
			await this.readyPromise;
			return;
		}

		await this.connect();
	}
}
