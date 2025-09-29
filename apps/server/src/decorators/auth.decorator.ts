import "reflect-metadata";
import { ServiceResponse } from "@/types";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt.utils";
import {
	METADATA_KEYS,
	type AuthMetadata,
} from "@/constants/metadata.constants";

export function Auth() {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		// Stocker les métadonnées
		const metadata: AuthMetadata = { required: true };
		Reflect.defineMetadata(
			METADATA_KEYS.AUTH,
			metadata,
			target,
			propertyKey
		);

		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const req = args[0];
			const res = args[1];

			try {
				const authHeader = req.headers["authorization"];

				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					const response = ServiceResponse.failure(
						"Unauthorized: No token provided",
						null,
						StatusCodes.UNAUTHORIZED
					);
					return res.status(response.statusCode).json(response);
				}

				const token = authHeader.substring(7);
				const decoded = JwtUtils.verifyToken(token);

				req.user = decoded;

				return originalMethod.apply(this, args);
			} catch (error) {
				const response = ServiceResponse.failure(
					"Unauthorized: Invalid or expired token",
					null,
					StatusCodes.UNAUTHORIZED
				);
				return res.status(response.statusCode).json(response);
			}
		};

		return descriptor;
	};
}
