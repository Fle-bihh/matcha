import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserRepository } from "@/repositories";
import {
	RegisterRequestDto,
	RegisterResponseDto,
	LoginResponseDto,
	RefreshTokenRequestDto,
	RefreshTokenResponseDto,
} from "@/dto/auth.dto";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt.utils";
import { HashUtils } from "@/utils/hash.utils";
import { UserWithPassword } from "@matcha/shared";

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

			const { accessToken, refreshToken } = JwtUtils.generateTokens(user);

			return ServiceResponse.success("User registered successfully", {
				accessToken,
				refreshToken,
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
			const { accessToken, refreshToken } = JwtUtils.generateTokens(user);

			return ServiceResponse.success("User logged in successfully", {
				accessToken,
				refreshToken,
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

	public async refreshToken(
		dto: RefreshTokenRequestDto
	): Promise<ServiceResponse<RefreshTokenResponseDto | null>> {
		try {
			const { userId } = JwtUtils.verifyRefreshToken(dto.refreshToken);

			const users = await this.userRepository.getDocs<UserWithPassword>(
				"users",
				{
					where: "id = ?",
					values: [userId],
				}
			);

			if (!users || users.length === 0) {
				return ServiceResponse.failure(
					"Invalid refresh token",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const userWithPassword = users[0];
			const { password: _, ...user } = userWithPassword;
			const { accessToken, refreshToken } = JwtUtils.generateTokens(user);

			return ServiceResponse.success("Token refreshed successfully", {
				accessToken,
				refreshToken,
			});
		} catch (error) {
			return ServiceResponse.failure(
				"Invalid or expired refresh token",
				null,
				StatusCodes.UNAUTHORIZED
			);
		}
	}
}
