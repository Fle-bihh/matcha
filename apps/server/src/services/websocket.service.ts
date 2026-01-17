import { Server as WebSocketServer } from "socket.io";
import { ETokens, IContainer } from "@/types";
import { BaseService } from "./base.service";
import {
	ConnectedUser,
	IWebSocketService,
	AuthenticatedSocket,
} from "@/types/websocket.types";
import {
	logger,
	EWebSocketEvents,
	IWebSocketEventDtoMap,
} from "@matcha/shared";
import { authenticateSocket } from "@/middleware/websocket-auth.middleware";
import { UserStatusRepository } from "@/repositories";
import { WebSocketConnectionManager } from "@/utils/websocket-connection.utils";

export class WebSocketService extends BaseService implements IWebSocketService {
	private io: WebSocketServer | null = null;
	private connectionManager = new WebSocketConnectionManager();

	constructor(container: IContainer) {
		super(container);
	}

	protected get UserStatusRepository(): UserStatusRepository {
		return this.container.get<UserStatusRepository>(
			ETokens.UserStatusRepository
		);
	}

	public initialize(io: WebSocketServer): void {
		this.io = io;
		this.io.use(authenticateSocket);
		this.setupEventHandlers();
		logger.info("WebSocket service initialized");
	}

	private setupEventHandlers(): void {
		if (!this.io) return;

		this.io.on(EWebSocketEvents.Connect, (socket) => {
			const authSocket = socket as AuthenticatedSocket;
			this.onConnect(authSocket);
			authSocket.on(EWebSocketEvents.Disconnect, () => {
				this.onDisconnect(authSocket);
			});
		});
	}

	private async onConnect(socket: AuthenticatedSocket): Promise<void> {
		try {
			const userId = socket.user.id;
			this.connectionManager.add(userId, socket);
			await this.UserStatusRepository.setUserOnline(userId);
			logger.info(`User ${userId} connected with socket ${socket.id}`);
		} catch (error) {
			logger.error(`Error handling user connection: ${error}`);
			socket.disconnect();
		}
	}

	private async onDisconnect(socket: AuthenticatedSocket): Promise<void> {
		try {
			const userId = socket.user.id;
			this.connectionManager.remove(userId);
			await this.UserStatusRepository.setUserOffline(userId);
			logger.info(`User ${userId} disconnected`);
		} catch (error) {
			logger.error(`Error handling user disconnection: ${error}`);
		}
	}

	public emitToUser<K extends keyof IWebSocketEventDtoMap>(
		userId: number,
		event: K,
		data: IWebSocketEventDtoMap[K]
	): void {
		try {
			logger.debug(
				`Emitting event ${event} to user ${userId} with data:`,
				data
			);
			const user = this.connectionManager.get(userId);
			if (user) {
				user.socket.emit(event, data);
			}
		} catch (error) {
			logger.error(
				`Error emitting event ${event} to user ${userId}: ${error}`
			);
		}
	}

	public emitToAll<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		data: IWebSocketEventDtoMap[K]
	): void {
		try {
			if (this.io) {
				this.io.emit(event, data);
			}
		} catch (error) {
			logger.error(
				`Error emitting event ${event} to all users: ${error}`
			);
		}
	}

	public getConnectedUsers(): Map<number, ConnectedUser> {
		return this.connectionManager.getAll();
	}

	public isUserConnected(userId: number): boolean {
		return this.connectionManager.has(userId);
	}
}
