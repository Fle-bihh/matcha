import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { UserService } from "./user.service";
import {
	RegisterRequestDto,
	RegisterResponseDto,
	LoginResponseDto,
	RefreshTokenRequestDto,
	RefreshTokenResponseDto,
	logger,
	AuthenticateRequestDto,
	AuthenticateResponseDto,
	LoginRequestDto,
} from "@matcha/shared";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt.utils";
import { HashUtils } from "@/utils/hash.utils";

export class AuthService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}

	public async authenticate(dto: AuthenticateRequestDto): Promise<ServiceResponse<AuthenticateResponseDto | null>> {
		try {
			const payload = JwtUtils.decodeToken(dto.accessToken);

			if (!payload || !payload.id) {
				return ServiceResponse.failure(
					"Invalid access token",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const userResponse = await this.userService.findById(payload.id.toString());

			if (!userResponse.success || !userResponse.responseObject) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			return ServiceResponse.success("User authenticated successfully", {
				user: userResponse.responseObject,
			});
			
		} catch (error) {
			return ServiceResponse.failure(
				"Authentication failed",
				null,
				StatusCodes.UNAUTHORIZED
			);
		}
	}

	public async register(
		dto: RegisterRequestDto
	): Promise<ServiceResponse<RegisterResponseDto | null>> {
		try {
			let existingUserResponse = await this.userService.findByEmail(
				dto.email
			);

			if (
				!existingUserResponse.success ||
				existingUserResponse.responseObject
			) {
				return ServiceResponse.failure(
					"Email already in use",
					null,
					StatusCodes.CONFLICT
				);
			}

			existingUserResponse = await this.userService.findByUsername(
				dto.username
			);

			if (
				!existingUserResponse.success ||
				existingUserResponse.responseObject
			) {
				return ServiceResponse.failure(
					"Username already in use",
					null,
					StatusCodes.CONFLICT
				);
			}

			const hashedPassword = await HashUtils.hashPassword(dto.password);

			const userData = {
				...dto,
				password: hashedPassword,
			};

			const userResponse = await this.userService.createUser(userData);

			if (!userResponse.success || !userResponse.responseObject) {
				return ServiceResponse.failure(
					userResponse.message,
					null,
					userResponse.statusCode
				);
			}

			const { accessToken, refreshToken } = JwtUtils.generateTokens(
				userResponse.responseObject
			);

			return ServiceResponse.success("User registered successfully", {
				accessToken,
				refreshToken,
				user: userResponse.responseObject,
			});
		} catch (error) {
			logger.error("Error in register:", error);
			return ServiceResponse.failure(
				"Error creating user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async login(
		dto: LoginRequestDto
	): Promise<ServiceResponse<LoginResponseDto | null>> {
		try {
			const { email, password } = dto;
			const userResponse = await this.userService.findByEmailWithPassword(
				email
			);

			if (!userResponse.success || !userResponse.responseObject) {
				return ServiceResponse.failure(
					"Invalid credentials",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const userWithPassword = userResponse.responseObject;
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

			const userResponse = await this.userService.findById(
				userId.toString()
			);

			if (!userResponse.success || !userResponse.responseObject) {
				return ServiceResponse.failure(
					"Invalid refresh token",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const user = userResponse.responseObject;
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
