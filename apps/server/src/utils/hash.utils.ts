import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export class HashUtils {
	static async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, SALT_ROUNDS);
	}

	static async comparePassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}
}
