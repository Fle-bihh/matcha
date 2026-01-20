import jwt, { SignOptions } from "jsonwebtoken";
import { AuthUser, User } from "@matcha/shared";
import { config } from "@/config";
import { JwtPayload } from "@/types";

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export class JwtUtils {
	static generateTokens(user: AuthUser): TokenPair {
		const payload: JwtPayload = {
			user_id: user.id,
		};

		const accessToken = jwt.sign(payload, config.jwtSecret, {
			expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
		});

		const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
			expiresIn: config.jwtRefreshExpiresIn as SignOptions["expiresIn"],
		});

		return { accessToken, refreshToken };
	}

	static verifyToken(token: string): JwtPayload {
		return jwt.verify(token, config.jwtSecret) as JwtPayload;
	}

	static verifyRefreshToken(token: string): JwtPayload {
		return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
	}

	static decodeToken(token: string): JwtPayload | null {
		try {
			return jwt.decode(token) as JwtPayload;
		} catch {
			return null;
		}
	}
}
