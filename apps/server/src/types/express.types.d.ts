import { JwtPayload } from "./auth.types";
import { PaginationParams } from "./pagination.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;

      validated?: {
        query?: any;
        body?: any;
        params?: any;
      };

      pagination?: PaginationParams;
    }
  }
}
