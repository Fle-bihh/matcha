import { Request, Response } from "express";
import { UsersService } from "../services/users.service.js";
import { HttpStatus } from "../../../core/constants/index.js";

export class UsersController {
	private readonly usersService = new UsersService();

	public async getUsers(req: Request, res: Response): Promise<void> {
		try {
			const users = await this.usersService.getAllUsers();
			res.status(HttpStatus.OK).json(users);
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				error: "Failed to fetch users",
			});
		}
	}
}
