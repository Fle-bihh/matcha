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
			id: user.id,
			username: user.username,
			email: user.email,
		};

		const accessToken = jwt.sign(payload, config.jwtSecret, {
			expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
		});

		const refreshToken = jwt.sign(
			{ userId: user.id },
			config.jwtRefreshSecret,
			{
				expiresIn:
					config.jwtRefreshExpiresIn as SignOptions["expiresIn"],
			}
		);

		return { accessToken, refreshToken };
	}

	static verifyToken(token: string): JwtPayload {
		return jwt.verify(token, config.jwtSecret) as JwtPayload;
	}

	static verifyRefreshToken(token: string): { userId: number } {
		return jwt.verify(token, config.jwtRefreshSecret) as { userId: number };
	}

	static decodeToken(token: string): JwtPayload | null {
		try {
			return jwt.decode(token) as JwtPayload;
		} catch {
			return null;
		}
	}
}
