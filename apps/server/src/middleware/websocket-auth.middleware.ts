import { Socket } from "socket.io";
import { JwtUtils } from "@/utils";
import { logger } from "@matcha/shared";
import { AuthenticatedSocket } from "@/types";

export const authenticateSocket = (
	socket: Socket,
	next: (err?: Error) => void,
): void => {
	try {
		const token = socket.handshake.auth.token;

		if (!token) {
			logger.warn(`Socket ${socket.id} connection rejected: No token`);
			return next(new Error("Authentication error: No token provided"));
		}

		const decoded = JwtUtils.verifyToken(token);
		(socket as AuthenticatedSocket).user = decoded;

		logger.info(`Socket ${socket.id} authenticated as user ${decoded.id}`);
		next();
	} catch (error) {
		logger.warn(`Socket ${socket.id} authentication failed:`, error);
		next(new Error("Authentication error: Invalid or expired token"));
	}
};
