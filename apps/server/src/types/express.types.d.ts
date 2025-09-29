import { JwtPayload } from "@/utils/jwt.utils";

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;

			validated?: {
				query?: any;
				body?: any;
				params?: any;
			};
		}
	}
}
