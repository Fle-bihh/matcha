import { AuthenticatedSocket, ConnectedUser } from "@/types";
import { logger } from "@matcha/shared";

export class WebSocketConnectionManager {
	private connections: Map<number, ConnectedUser> = new Map();

	public add(userId: number, socket: AuthenticatedSocket): void {
		const existing = this.connections.get(userId);
		if (existing) {
			logger.info(
				`User ${userId} reconnecting, disconnecting previous socket ${existing.socketId}`,
			);
			existing.socket.disconnect();
		}

		this.connections.set(userId, {
			userId,
			socketId: socket.id,
			socket,
		});
	}

	public remove(userId: number): void {
		this.connections.delete(userId);
	}

	public get(userId: number): ConnectedUser | undefined {
		return this.connections.get(userId);
	}

	public has(userId: number): boolean {
		return this.connections.has(userId);
	}

	public getAll(): Map<number, ConnectedUser> {
		return new Map(this.connections);
	}
}
