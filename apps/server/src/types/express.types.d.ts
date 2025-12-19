import { JwtPayload } from "./auth.types";

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
