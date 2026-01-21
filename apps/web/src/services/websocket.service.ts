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
	BlockHandler,
	LikeHandler,
	MatchHandler,
	UserStatusHandler,
	VisitHandler,
} from "@/handlers";
import { MessageHandler } from "@/handlers/message.handler";

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
			new BlockHandler(container),
			new MessageHandler(container),
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
			logger.warn(
				"WebSocket connection skipped: No access token available",
			);
			return;
		}

		try {
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
		} catch (error) {
			logger.error("WebSocket connection error:", error);
			this.readyPromise = null;
			throw error;
		}
	}

	private setupEventHandlers(): void {
		if (!this.socket) return;

		this.socket.on(EWebSocketEvents.Disconnect, (reason) => {
			logger.info(`WebSocket disconnected: ${reason}`);
			this.readyPromise = null;
		});

		this.socket.on("error", (error: Error) => {
			logger.error("WebSocket error:", error);
		});

		this.socket.on("connect_error", (error: Error) => {
			logger.error("WebSocket connection error:", error);
		});

		this.socket.onAny((event: string, ...args: any[]) => {
			const dto = args[0];
			if (dto && "notification" in dto) {
				logger.debug(
					`WebSocket event received with notification: ${event}`,
					dto.notification,
				);
			} else if (dto) {
				logger.debug(
					`WebSocket event received with dto only: ${event}`,
					dto,
				);
			} else {
				logger.debug(`WebSocket event received: ${event}`);
			}
		});

		this.handlers.forEach((handler) => {
			try {
				handler.register(this.socket!);
			} catch (error) {
				logger.error(
					`Failed to register handler ${handler.constructor.name}:`,
					error,
				);
			}
		});
	}

	public disconnect(): void {
		try {
			if (this.socket) {
				this.handlers.forEach((handler) => {
					try {
						handler.unregister(this.socket!);
					} catch (error) {
						logger.error(
							`Failed to unregister handler ${handler.constructor.name}:`,
							error,
						);
					}
				});
				this.socket.disconnect();
				this.socket = null;
				this.readyPromise = null;
				logger.info("WebSocket disconnected");
			}
		} catch (error) {
			logger.error("WebSocket disconnect error:", error);
		}
	}

	public async on<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		callback: (data: IWebSocketEventDtoMap[K]) => void,
	): Promise<void> {
		try {
			await this.ensureReady();
			if (!this.socket?.connected) {
				logger.warn(
					`Cannot attach listener for event ${String(event)}: Socket not connected`,
				);
				return;
			}
			this.socket.on(event as string, callback);
		} catch (error) {
			logger.warn(
				`Failed to attach listener for event ${String(event)}:`,
				error,
			);
		}
	}

	public async off<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		callback?: (data: IWebSocketEventDtoMap[K]) => void,
	): Promise<void> {
		try {
			await this.ensureReady();
			if (!this.socket?.connected) {
				logger.warn(
					`Cannot remove listener for event ${String(event)}: Socket not connected`,
				);
				return;
			}
			this.socket.off(event as string, callback);
		} catch (error) {
			logger.warn(
				`Failed to remove listener for event ${String(event)}:`,
				error,
			);
		}
	}

	public async emit<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		data: IWebSocketEventDtoMap[K],
	): Promise<void> {
		try {
			await this.ensureReady();
			if (!this.socket?.connected) {
				logger.warn(
					`Cannot emit event ${String(event)}: Socket not connected`,
				);
				return;
			}
			this.socket.emit(event as string, data);
		} catch (error) {
			logger.warn(`Failed to emit event ${String(event)}:`, error);
		}
	}

	public isConnected(): boolean {
		return this.socket?.connected ?? false;
	}

	private async ensureReady(): Promise<void> {
		if (this.socket?.connected) {
			return;
		}

		if (this.readyPromise) {
			try {
				await this.readyPromise;
			} catch (error) {
				logger.warn("WebSocket connection attempt failed:", error);
			}
			return;
		}

		try {
			await this.connect();
		} catch (error) {
			logger.warn("Failed to establish WebSocket connection:", error);
		}
	}
}
