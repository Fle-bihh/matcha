import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { config } from "./src/config.ts";

if (process.env.NODE_ENV === "production") {
	console.log("Production mode");
} else {
	console.log("Development mode");
}

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
		port: config.port,
		allowedHosts: [config.webUrl],
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
