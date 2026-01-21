import { Socket } from "socket.io";
import {
	WebSocketEvents,
	WebSocketEventDtoMap,
	TWebSocketChannel,
} from "@matcha/shared";
import { JwtPayload } from "./auth.types";

export interface AuthenticatedSocket extends Socket {
	user: JwtPayload;
}

export interface ConnectedUser {
	userId: number;
	socketId: string;
	socket: AuthenticatedSocket;
}

export type WebSocketEventHandler<K extends keyof WebSocketEventDtoMap> = (
	socket: AuthenticatedSocket,
	data: WebSocketEventDtoMap[K],
) => void | Promise<void>;

export interface IWebSocketService {
	initialize(io: any): void;
	emitToUser<K extends keyof WebSocketEventDtoMap>(
		userId: number,
		event: K,
		data: WebSocketEventDtoMap[K],
	): void;
	emitToAll<K extends keyof WebSocketEventDtoMap>(
		event: K,
		data: WebSocketEventDtoMap[K],
	): void;
	emitToChannel<K extends keyof WebSocketEventDtoMap>(
		channel: TWebSocketChannel,
		event: K,
		data: WebSocketEventDtoMap[K],
	): void;
	getConnectedUsers(): Map<number, ConnectedUser>;
	isUserConnected(userId: number): boolean;
}
