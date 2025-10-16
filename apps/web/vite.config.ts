import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "0.0.0.0",
		port: process.env.WEB_PORT ? parseInt(process.env.WEB_PORT) : 3001,
		allowedHosts: [process.env.WEB_URL || "localhost"],
	},
	optimizeDeps: {
		include: ["@matcha/shared"],
	},
	build: {
		commonjsOptions: {
			include: [/packages/, /node_modules/],
		},
	},
});
