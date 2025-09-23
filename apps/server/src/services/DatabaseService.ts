import mysql from "mysql2/promise";

export class DatabaseService {
	private connection: mysql.Connection | null = null;

	async connect(): Promise<void> {
		try {
			this.connection = await mysql.createConnection({
				host: "mysql",
				user: "matcha_user",
				password: "matcha_password",
				database: "matcha",
			});

			// Créer une table simple pour le test
			await this.connection.execute(`
                CREATE TABLE IF NOT EXISTS test_values (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    value VARCHAR(255) NOT NULL
                )
            `);

			// Insérer une valeur de test si elle n'existe pas
			const [rows] = await this.connection.execute(
				"SELECT COUNT(*) as count FROM test_values"
			);

			if ((rows as any)[0].count === 0) {
				await this.connection.execute(
					"INSERT INTO test_values (name, value) VALUES (?, ?)",
					["test_connection", "Database connection successful!"]
				);
			}
		} catch (error) {
			console.error("Database connection failed:", error);
			throw error;
		}
	}

	async getTestValue(): Promise<string> {
		if (!this.connection) {
			throw new Error("Database not connected");
		}

		const [rows] = await this.connection.execute(
			"SELECT value FROM test_values WHERE name = ?",
			["test_connection"]
		);

		return (rows as any)[0]?.value || "No test value found";
	}
}
