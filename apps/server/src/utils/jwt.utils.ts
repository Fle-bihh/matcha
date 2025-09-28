import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "@matcha/shared";

const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 24 * 60 * 60;

export interface JwtPayload {
	id: number;
	username: string;
	email: string;
}

export class JwtUtils {
	static generateToken(user: User): string {
		const payload: JwtPayload = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		const options: SignOptions = {
			expiresIn: JWT_EXPIRES_IN,
		};

		return jwt.sign(payload, JWT_SECRET, options);
	}

	static verifyToken(token: string): JwtPayload {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	}

	static decodeToken(token: string): JwtPayload | null {
		try {
			return jwt.decode(token) as JwtPayload;
		} catch {
			return null;
		}
	}
}
