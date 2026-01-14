import { Socket } from "socket.io";
import { EWebSocketEvents, IWebSocketEventDtoMap } from "@matcha/shared";
import { JwtPayload } from "./auth.types";

export interface AuthenticatedSocket extends Socket {
	user: JwtPayload;
}

export interface ConnectedUser {
	userId: number;
	socketId: string;
	socket: AuthenticatedSocket;
}

export type WebSocketEventHandler<K extends keyof IWebSocketEventDtoMap> = (
	socket: AuthenticatedSocket,
	data: IWebSocketEventDtoMap[K]
) => void | Promise<void>;

export interface IWebSocketService {
	initialize(io: any): void;
	emitToUser<K extends keyof IWebSocketEventDtoMap>(
		userId: number,
		event: K,
		data: IWebSocketEventDtoMap[K]
	): void;
	emitToAll<K extends keyof IWebSocketEventDtoMap>(
		event: K,
		data: IWebSocketEventDtoMap[K]
	): void;
	getConnectedUsers(): Map<number, ConnectedUser>;
	isUserConnected(userId: number): boolean;
}
