import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xss from "xss";
import { config } from "@/config";

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
	standardHeaders: true,
	legacyHeaders: false,
});

export const corsOptions = {
	origin: config.webUrl,
	credentials: true,
	optionsSuccessStatus: 200,
	preflightContinue: true,
};

export const helmetConfig = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https:"],
		},
	},
});

export const sqlSanitize = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const sanitizeValue = (value: any): any => {
		if (typeof value === "string") {
			return value.replace(/['";\\]/g, "");
		}
		return value;
	};

	const sanitizeObject = (obj: any): void => {
		for (let key in obj) {
			if (obj[key] && typeof obj[key] === "object") {
				sanitizeObject(obj[key]);
			} else {
				obj[key] = sanitizeValue(obj[key]);
			}
		}
	};

	if (req.body) sanitizeObject(req.body);
	if (req.query) sanitizeObject(req.query);
	if (req.params) sanitizeObject(req.params);

	next();
};

export const xssSanitize = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const sanitizeXSS = (obj: any): void => {
		for (let key in obj) {
			if (obj[key] && typeof obj[key] === "object") {
				sanitizeXSS(obj[key]);
			} else if (typeof obj[key] === "string") {
				obj[key] = xss(obj[key]);
			}
		}
	};

	if (req.body) sanitizeXSS(req.body);
	if (req.query) sanitizeXSS(req.query);

	next();
};

export const hppMiddleware = hpp();
