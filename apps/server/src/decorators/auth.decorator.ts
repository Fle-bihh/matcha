import { ServiceResponse } from "@/types";
import { StatusCodes } from "http-status-codes";

export function Auth() {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const req = args[0];
			const authHeader = req.headers["authorization"];
			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				const res = args[1];
				const response = ServiceResponse.failure(
					"Unauthorized: No token provided",
					null,
					StatusCodes.UNAUTHORIZED
				);
				return res.status(response.statusCode).json(response);
			}
			const token = authHeader.split(" ")[1];
			if (token !== "temp-token") {
				const res = args[1];
				const response = ServiceResponse.failure(
					"Unauthorized: Invalid token",
					null,
					StatusCodes.UNAUTHORIZED
				);
				return res.status(response.statusCode).json(response);
			}
			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}
