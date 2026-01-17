import { Server as WebSocketServer } from "socket.io";
import { ETokens, IContainer } from "@/types";
import { BaseService } from "./base.service";
import {
	ConnectedUser,
	IWebSocketService,
	AuthenticatedSocket,
	WebSocketEventHandler,
} from "@/types/websocket.types";
import {
	logger,
	EWebSocketEvents,
	IWebSocketEventDtoMap,
} from "@matcha/shared";
import { authenticateSocket } from "@/middleware/websocket-auth.middleware";
import { UserStatusRepository } from "@/repositories";

export class WebSocketService extends BaseService implements IWebSocketService {
	private io: WebSocketServer | null = null;
	private connectedUsers: Map<number, ConnectedUser> = new Map();

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

		this.io.on(EWebSocketEvents.Connect, (socket: any) => {
			const authSocket = socket as AuthenticatedSocket;
			this.handleUserConnection(authSocket);

			authSocket.on(EWebSocketEvents.Disconnect, () => {
				this.handleUserDisconnection(authSocket);
			});
		});
	}

	private async handleUserConnection(
		socket: AuthenticatedSocket
	): Promise<void> {
		const userId = socket.user.id;
		const existingConnection = this.connectedUsers.get(userId);

		if (existingConnection) {
			logger.info(
				`User ${userId} reconnecting, disconnecting previous socket ${existingConnection.socketId}`
			);
			existingConnection.socket.disconnect();
		}

		this.connectedUsers.set(userId, {
			userId,
			socketId: socket.id,
			socket,
		});

		await this.UserStatusRepository.setUserOnline(userId);

		logger.info(`User ${userId} connected with socket ${socket.id}`);
	}

	private async handleUserDisconnection(
		socket: AuthenticatedSocket
	): Promise<void> {
		const userId = socket.user.id;
		this.connectedUsers.delete(userId);
		await this.UserStatusRepository.setUserOffline(userId);
		logger.info(`User ${userId} disconnected`);
	}

	public emitToUser<K extends keyof IWebSocketEventDtoMap>(
		userId: number,
		event: K,
		data: IWebSocketEventDtoMap[K]
	): void {
		logger.debug(
			`Emitting event ${event} to user ${userId} with data:`,
			data
		);
		const user = this.connectedUsers.get(userId);
		if (user) {
			user.socket.emit(event as string, data);
		}
	}

	public emitToAll<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		data: IWebSocketEventDtoMap[K]
	): void {
		if (this.io) {
			this.io.emit(event as string, data);
		}
	}

	public getConnectedUsers(): Map<number, ConnectedUser> {
		return new Map(this.connectedUsers);
	}

	public isUserConnected(userId: number): boolean {
		return this.connectedUsers.has(userId);
	}
}
