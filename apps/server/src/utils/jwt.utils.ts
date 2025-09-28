import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "@matcha/shared";
import { config } from "@/config";
import { JwtPayload } from "@/types";

export class JwtUtils {
	static generateToken(user: User): string {
		const payload: JwtPayload = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		const options: SignOptions = {
			expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
		};

		return jwt.sign(payload, config.jwtSecret, options);
	}

	static verifyToken(token: string): JwtPayload {
		return jwt.verify(token, config.jwtSecret) as JwtPayload;
	}

	static decodeToken(token: string): JwtPayload | null {
		try {
			return jwt.decode(token) as JwtPayload;
		} catch {
			return null;
		}
	}
}
