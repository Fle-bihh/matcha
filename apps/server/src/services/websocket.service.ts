import { Server as WebSocketServer } from "socket.io";
import {
	ETokens,
	IContainer,
	ConnectedUser,
	IWebSocketService,
	AuthenticatedSocket,
} from "@/types";
import { BaseService } from "./base.service";
import {
	logger,
	WebSocketEvents,
	WebSocketEventDtoMap,
	SubscribeChannelRequestDto,
	UnsubscribeChannelRequestDto,
	EWebSocketChannels,
	TWebSocketChannel,
} from "@matcha/shared";
import { authenticateSocket } from "@/middleware";
import { WebSocketConnectionManager } from "@/utils";

export class WebSocketService extends BaseService implements IWebSocketService {
	private io: WebSocketServer | null = null;
	private connectionManager = new WebSocketConnectionManager();
	private channelSubscriptions: Map<TWebSocketChannel, Set<string>> =
		new Map();

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

		this.io.on(WebSocketEvents.Connect, (socket) => {
			const authSocket = socket as AuthenticatedSocket;
			this.onConnect(authSocket);

			authSocket.on(
				WebSocketEvents.Subscribe,
				(data: SubscribeChannelRequestDto) => {
					this.handleSubscribe(authSocket, data);
				},
			);

			authSocket.on(
				WebSocketEvents.Unsubscribe,
				(data: UnsubscribeChannelRequestDto) => {
					this.handleUnsubscribe(authSocket, data);
				},
			);

			authSocket.on(WebSocketEvents.Disconnect, () => {
				this.onDisconnect(authSocket);
			});
		});
	}

	private async onConnect(socket: AuthenticatedSocket): Promise<void> {
		try {
			const userId = socket.user.user_id;
			this.connectionManager.add(userId, socket);
			await this.userService.setUserOnline(userId);
			logger.info(`User ${userId} connected with socket ${socket.id}`);
		} catch (error) {
			logger.error(`Error handling user connection: ${error}`);
			socket.disconnect();
		}
	}

	private async onDisconnect(socket: AuthenticatedSocket): Promise<void> {
		try {
			const userId = socket.user.user_id;
			this.cleanupSocketSubscriptions(socket.id);
			this.connectionManager.remove(userId);
			await this.userService.setUserOffline(userId);
			logger.info(`User ${userId} disconnected`);
		} catch (error) {
			logger.error(`Error handling user disconnection: ${error}`);
		}
	}

	private handleSubscribe(
		socket: AuthenticatedSocket,
		data: SubscribeChannelRequestDto,
	): void {
		try {
			const { channel } = data;

			if (!this.channelSubscriptions.has(channel)) {
				this.channelSubscriptions.set(channel, new Set());
			}

			this.channelSubscriptions.get(channel)!.add(socket.id);

			socket.emit(WebSocketEvents.SubscriptionConfirmed, {
				channel,
				subscribed: true,
			});

			logger.debug(
				`Socket ${socket.id} subscribed to channel: ${channel}`,
			);
		} catch (error) {
			logger.error(`Error handling subscribe: ${error}`);
		}
	}

	private handleUnsubscribe(
		socket: AuthenticatedSocket,
		data: UnsubscribeChannelRequestDto,
	): void {
		try {
			const { channel } = data;

			const subscribers = this.channelSubscriptions.get(channel);
			if (subscribers) {
				subscribers.delete(socket.id);
				if (subscribers.size === 0) {
					this.channelSubscriptions.delete(channel);
				}
			}

			socket.emit(WebSocketEvents.SubscriptionConfirmed, {
				channel,
				subscribed: false,
			});

			logger.debug(
				`Socket ${socket.id} unsubscribed from channel: ${channel}`,
			);
		} catch (error) {
			logger.error(`Error handling unsubscribe: ${error}`);
		}
	}

	private cleanupSocketSubscriptions(socketId: string): void {
		for (const [
			channel,
			subscribers,
		] of this.channelSubscriptions.entries()) {
			subscribers.delete(socketId);
			if (subscribers.size === 0) {
				this.channelSubscriptions.delete(channel);
			}
		}
	}

	public emitToUser<K extends keyof WebSocketEventDtoMap>(
		userId: number,
		event: K,
		data: WebSocketEventDtoMap[K],
	): void {
		try {
			logger.debug(
				`Emitting event ${event} to user ${userId} with data:`,
				data,
			);
			const user = this.connectionManager.get(userId);
			if (user) {
				user.socket.emit(event, data);
			}
		} catch (error) {
			logger.error(
				`Error emitting event ${event} to user ${userId}: ${error}`,
			);
		}
	}

	public emitToAll<K extends keyof WebSocketEventDtoMap>(
		event: K,
		data: WebSocketEventDtoMap[K],
	): void {
		try {
			if (this.io) {
				this.io.emit(event, data);
			}
		} catch (error) {
			logger.error(
				`Error emitting event ${event} to all users: ${error}`,
			);
		}
	}

	public getConnectedUsers(): Map<number, ConnectedUser> {
		return this.connectionManager.getAll();
	}

	public isUserConnected(userId: number): boolean {
		return this.connectionManager.has(userId);
	}

	public emitToChannel<K extends keyof WebSocketEventDtoMap>(
		channel: TWebSocketChannel,
		event: K,
		data: WebSocketEventDtoMap[K],
	): void {
		try {
			const subscribers = this.channelSubscriptions.get(channel);
			if (!subscribers || subscribers.size === 0) {
				logger.debug(`No subscribers for channel: ${channel}`);
				return;
			}

			logger.debug(
				`Emitting event ${event} to channel ${channel} with ${subscribers.size} subscribers`,
			);

			for (const socketId of subscribers) {
				if (this.io) {
					this.io.to(socketId).emit(event, data);
				}
			}
		} catch (error) {
			logger.error(
				`Error emitting event ${event} to channel ${channel}: ${error}`,
			);
		}
	}
}
