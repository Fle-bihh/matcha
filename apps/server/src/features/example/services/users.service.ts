import { pool } from "../../../core/db/mysqlPool.js";
import { User } from "../types/users.types.js";

export class UsersService {
	public async getAllUsers(): Promise<User[]> {
		const [rows] = await pool.query(
			"SELECT id, username, email FROM users"
		);
		return rows as User[];
	}
}
