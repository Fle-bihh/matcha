import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories";
import {
	RegisterRequestDto,
	RegisterResponseDto,
	LoginResponseDto,
} from "@/dto/auth.dto";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt.utils";
import { HashUtils } from "@/utils/hash.utils";

export class AuthService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	public async register(
		dto: RegisterRequestDto
	): Promise<ServiceResponse<RegisterResponseDto | null>> {
		try {
			// Hash the password before saving
			const hashedPassword = await HashUtils.hashPassword(dto.password);

			// Create user with hashed password
			const userData = {
				...dto,
				password: hashedPassword,
			};

			const user = await this.userRepository.createUser(userData);

			// Generate JWT token
			const token = JwtUtils.generateToken(user);

			// Return user data without password
			const { password: _, ...userWithoutPassword } = user;

			return ServiceResponse.success("User registered successfully", {
				token,
				user: userWithoutPassword as any, // Cast needed due to password field removal
			});
		} catch (error) {
			return ServiceResponse.failure(
				"Error creating user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async login(
		email: string,
		password: string
	): Promise<ServiceResponse<LoginResponseDto | null>> {
		try {
			// Find user by email
			const user = await this.userRepository.findUserByEmail(email);

			if (!user) {
				return ServiceResponse.failure(
					"Invalid credentials",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			// Check password
			const isPasswordValid = await HashUtils.comparePassword(
				password,
				user.password
			);

			if (!isPasswordValid) {
				return ServiceResponse.failure(
					"Invalid credentials",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			// Generate JWT token
			const token = JwtUtils.generateToken(user);

			// Return user data without password
			const { password: _, ...userWithoutPassword } = user;

			return ServiceResponse.success("User logged in successfully", {
				token,
				user: userWithoutPassword as any,
			});
		} catch (error) {
			return ServiceResponse.failure(
				"Error during login",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
