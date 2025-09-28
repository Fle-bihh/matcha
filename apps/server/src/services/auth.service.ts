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
			const emailAlreadyExists =
				await this.userRepository.findUserByEmail(dto.email);

			if (emailAlreadyExists) {
				return ServiceResponse.failure(
					"Email already in use",
					null,
					StatusCodes.CONFLICT
				);
			}

			const hashedPassword = await HashUtils.hashPassword(dto.password);

			const userData = {
				...dto,
				password: hashedPassword,
			};

			const user = await this.userRepository.createUser(userData);

			const token = JwtUtils.generateToken(user);

			return ServiceResponse.success("User registered successfully", {
				token,
				user,
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
			const userWithPassword =
				await this.userRepository.findUserByEmailWithPassword(email);

			if (!userWithPassword) {
				return ServiceResponse.failure(
					"Invalid credentials",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const isPasswordValid = await HashUtils.comparePassword(
				password,
				userWithPassword.password
			);

			if (!isPasswordValid) {
				return ServiceResponse.failure(
					"Invalid credentials",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const { password: _, ...user } = userWithPassword;
			const token = JwtUtils.generateToken(user);

			return ServiceResponse.success("User logged in successfully", {
				token,
				user,
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
