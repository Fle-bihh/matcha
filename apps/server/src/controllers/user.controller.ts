import type { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ETokens } from "@/types";
import { UserService } from "@/services";
import { auth, route, validate } from "@/decorators";
import { UpdateProfileDtoSchema } from "@matcha/shared";

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
}
