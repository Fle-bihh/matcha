import { Request, Response, NextFunction } from "express";
import { ServiceResponse } from "@/types";
import { JwtUtils } from "@/utils";

export const authenticateRequest = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers["authorization"];

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			const response = ServiceResponse.failure(
				"Unauthorized: No token provided",
				null,
				401,
			);
			res.status(response.statusCode).json(response);
			return;
		}

		const token = authHeader.substring(7);
		const decoded = JwtUtils.verifyToken(token);
		req.user = decoded;

		next();
	} catch (error) {
		const response = ServiceResponse.failure(
			"Unauthorized: Invalid or expired token",
			null,
			401,
		);
		res.status(response.statusCode).json(response);
	}
};
