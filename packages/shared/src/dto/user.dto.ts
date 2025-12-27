import { z } from "zod";
import { fields } from "../validation";
import { AuthUser, Gender, Orientation } from "../models";
import { FileDto } from "./file.dto";

export const CreateUserDtoSchema = z.object({
  email: fields.email,
  username: fields.username,
  first_name: fields.firstName,
  last_name: fields.lastName,
  password: fields.password,
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateProfileDtoSchema = z.object({
  gender: z.enum(Gender).optional(),
  orientation: z.enum(Orientation).optional(),
  age: fields.age.optional(),
  bio: fields.bio.optional(),
  first_name: fields.firstName.optional(),
  last_name: fields.lastName.optional(),
  interests: fields.interests.optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;

export const UpdateProfilePictureDtoSchema = z.object({
  index: fields.formDataNumber,
});

export type UpdateProfilePictureDto = z.infer<
  typeof UpdateProfilePictureDtoSchema
> &
  FileDto;
