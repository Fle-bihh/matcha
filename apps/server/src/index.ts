import express from "express";
import { config } from "./config.js";
import { APP_NAME } from "@matcha/shared";
import { pool } from "./db.js";

const app = express();

app.get("/api/hello", (req, res) => {
	res.json({
		message: `Hello from ${APP_NAME} backend, DB=${config.db.name}`,
	});
});

app.get("/api/users", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT id, username, email FROM users");
		res.json(rows);
	} catch (err) {
		console.error("Error fetching users:", err);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

app.listen(config.apiPort, () => {
	console.log(`🚀 Server running at http://localhost:${config.apiPort}`);
});
