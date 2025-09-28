import { logger } from "@matcha/shared";
import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";

declare global {
	namespace Express {
		interface Request {
			validated?: {
				query?: any;
				body?: any;
				params?: any;
			};
		}
	}
}

export function Validate<T extends ZodType>(
	schema: T,
	source: "query" | "body" | "params" = "query"
) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const originalMethod = descriptor.value;

		descriptor.value = function (
			req: Request,
			res: Response,
			next?: NextFunction
		) {
			try {
				const data = req[source];

				const validatedData = schema.parse(data);

				if (!req.validated) {
					req.validated = {};
				}
				req.validated[source] = validatedData;

				try {
					if (source === "body") {
						req.body = validatedData;
					} else if (source === "params") {
						Object.assign(req.params, validatedData);
					} else if (source === "query") {
						Object.assign(req.query, validatedData);
					}
				} catch (assignError) {
					logger.debug(
						`Could not assign validated data to req.${source}, using req.validated.${source} instead`
					);
				}

				return originalMethod.call(this, req, res, next);
			} catch (error) {
				if (error instanceof z.ZodError) {
					return res.status(400).json({
						error: "Validation failed",
						details: error.issues.map((issue) => ({
							field: issue.path.join("."),
							message: issue.message,
							value:
								"received" in issue
									? issue.received
									: undefined,
						})),
					});
				}

				throw error;
			}
		};

		return descriptor;
	};
}
