import { Server as WebSocketServer } from "socket.io";
import { IContainer } from "@/types";
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

export class WebSocketService extends BaseService implements IWebSocketService {
	private io: WebSocketServer | null = null;
	private connectedUsers: Map<number, ConnectedUser> = new Map();
	private eventHandlers: Map<
		string,
		(socket: AuthenticatedSocket, data: any) => void | Promise<void>
	> = new Map();

	constructor(container: IContainer) {
		super(container);
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

			for (const [event, handler] of this.eventHandlers.entries()) {
				authSocket.on(event, (data: any) => {
					handler(authSocket, data);
				});
			}
		});
	}

	private handleUserConnection(socket: AuthenticatedSocket): void {
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

		logger.info(`User ${userId} connected with socket ${socket.id}`);
	}

	private handleUserDisconnection(socket: AuthenticatedSocket): void {
		const userId = socket.user.id;
		this.connectedUsers.delete(userId);
		logger.info(`User ${userId} disconnected`);
	}

	public registerEventHandler<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		handler: WebSocketEventHandler<K>
	): void {
		this.eventHandlers.set(event, handler);
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
