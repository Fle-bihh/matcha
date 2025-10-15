import { AllRouteKeys } from "@/constants/routes.constants";
import { HttpMethod } from "./routes.types";

export interface RouteMetadata {
	method: HttpMethod;
	path: string;
	key: AllRouteKeys;
}

export interface AuthMetadata {
	required: boolean;
}

export interface ValidateMetadata {
	schema: any;
	source: "query" | "body" | "params";
}
