import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";

// Extend the Express Request interface to include our validated data
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

export function ValidateZod<T extends ZodType>(
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

				// Store validated data in a custom property to avoid readonly issues
				if (!req.validated) {
					req.validated = {};
				}
				req.validated[source] = validatedData;

				// For backward compatibility, try to update the original property if possible
				try {
					if (source === "body") {
						req.body = validatedData;
					} else if (source === "params") {
						// For params, merge the validated data
						Object.assign(req.params, validatedData);
					} else if (source === "query") {
						// For query, we'll use Object.assign to merge validated data
						Object.assign(req.query, validatedData);
					}
				} catch (assignError) {
					// If assignment fails, the validated data is still available in req.validated
					console.warn(
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

				// Re-throw unexpected errors
				throw error;
			}
		};

		return descriptor;
	};
}
