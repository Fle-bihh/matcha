import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig(({ mode }) => {
	const host = "0.0.0.0";
	const port = process.env.WEB_PORT ? parseInt(process.env.WEB_PORT) : 3001;
	const allowedHosts = [process.env.WEB_URL || "localhost"];

	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			host,
			port,
			allowedHosts,
		},
		preview: {
			host,
			port,
		},
		optimizeDeps: {
			include: ["@matcha/shared"],
		},
		build: {
			commonjsOptions: {
				include: [/packages/, /node_modules/],
			},
		},
	};
});
