import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens, ServiceResponse } from "@/types";
import { UserService } from "@/services";
import { auth, route, validate, upload, paginate } from "@/decorators";
import {
	UpdateProfileDtoSchema,
	UpdateProfilePictureDtoSchema,
	UpdateLocationDtoSchema,
	BrowsingFiltersDtoSchema,
	UserIdParamsDtoSchema,
	ApiResponse,
} from "@matcha/shared";
import { uploadProfilePictureMiddleware } from "@/middleware";

export class UserController extends BaseController {
	private get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}

	@auth()
	@validate(UpdateProfileDtoSchema, "body")
	@route("PATCH", "update-profile")
	private async updateProfile(req: Request, res: Response): Promise<void> {
		const { id } = req.user!;
		const result = await this.userService.updateUser(
			id,
			req.validated?.body,
		);
		this.sendResult(res, result);
	}

	@auth()
	@upload(uploadProfilePictureMiddleware, {
		validation: {
			required: true,
		},
	})
	@validate(UpdateProfilePictureDtoSchema, "body")
	@route("PATCH", "update-profile-picture")
	private async updateProfilePicture(
		req: Request,
		res: Response,
	): Promise<void> {
		const imageFile = req.file!;
		const { index } = req.validated?.body!;
		const { id } = req.user!;
		const result = await this.userService.updateProfilePicture(
			id,
			imageFile,
			index,
		);
		this.sendResult(res, result);
	}

	@auth()
	@validate(UpdateLocationDtoSchema, "body")
	@route("PATCH", "update-location")
	private async updateLocation(req: Request, res: Response): Promise<void> {
		const { id } = req.user!;
		const result = await this.userService.updateLocation(
			id,
			req.validated?.body,
		);
		this.sendResult(res, result);
	}

	@auth()
	@paginate()
	@validate(BrowsingFiltersDtoSchema, "query")
	@route("GET", "get-users")
	private async getUsers(req: Request, res: Response): Promise<void> {
		const result = await this.userService.getUsers(
			req.user?.id!,
			req.pagination!,
			req.validated?.query!,
		);
		this.sendResult(res, result);
	}

	@auth()
	@validate(UserIdParamsDtoSchema, "params")
	@route("GET", "get-user-by-id")
	private async getUserById(req: Request, res: Response): Promise<void> {
		const { id } = req.validated?.params!;
		const result = await this.userService.getUserById(req.user!.id, id);
		this.sendResult(res, result);
	}
}
