import { config } from "@/config";

export const API_BASE_URL = config.apiUrl;

export const API_ROUTES = {
	register: "/auth/register",
	login: "/auth/login",
};
