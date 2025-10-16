import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
		port: 3001,
		allowedHosts: ["82e385e7e11f.ngrok-free.app"],
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
