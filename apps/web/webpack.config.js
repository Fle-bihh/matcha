import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "public"),
		},
		port: process.env.WEB_PORT || 5173, // 🔥 use env
		hot: true,
		historyApiFallback: true,
		proxy: {
			"/api": `http://server:${process.env.API_PORT || 3000}`,
		},
	},
};
