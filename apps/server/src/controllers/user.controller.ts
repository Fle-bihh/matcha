import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { UserService } from "@/services";
import { auth, route, validate, upload } from "@/decorators";
import {
  UpdateProfileDtoSchema,
  UpdateProfilePictureDtoSchema,
  UpdateLocationDtoSchema,
} from "@matcha/shared";
import { uploadProfilePictureMiddleware } from "@/middleware/upload.middleware";

export class UserController extends BaseController {
  private get userService(): UserService {
    return this.container.get<UserService>(ETokens.UserService);
  }

  @auth()
  @route("PATCH", "update-profile")
  @validate(UpdateProfileDtoSchema, "body")
  private async updateProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.user!;
    const result = await this.userService.updateUser(id, req.validated?.body);
    res.status(result.statusCode).send(result);
  }

  @auth()
  @route("PATCH", "update-profile-picture")
  @upload(uploadProfilePictureMiddleware, {
    validation: {
      required: true,
    },
  })
  @validate(UpdateProfilePictureDtoSchema, "body")
  private async updateProfilePicture(
    req: Request,
    res: Response
  ): Promise<void> {
    const imageFile = req.file!;
    const { index } = req.validated?.body!;
    const { id } = req.user!;
    const result = await this.userService.updateProfilePicture(
      id,
      imageFile,
      index
    );
    res.status(result.statusCode).send(result);
  }

  @auth()
  @route("PATCH", "update-location")
  @validate(UpdateLocationDtoSchema, "body")
  private async updateLocation(req: Request, res: Response): Promise<void> {
    const { id } = req.user!;
    const result = await this.userService.updateLocation(
      id,
      req.validated?.body
    );
    res.status(result.statusCode).send(result);
  }
}
