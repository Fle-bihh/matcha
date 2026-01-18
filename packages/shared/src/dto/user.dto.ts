import { z } from "zod";
import { fields } from "../validation";
import { AuthUser, Gender, Orientation, User, UserStatus } from "../models";
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

export const UpdateLocationDtoSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	city: z.string().nullable(),
	neighborhood: z.string().nullable(),
	country: z.string().nullable(),
	display_name: z.string(),
	manually_set: z.boolean(),
});

export type UpdateLocationDto = z.infer<typeof UpdateLocationDtoSchema>;

export const UserIdParamsDtoSchema = z.object({
	id: z.coerce.number().int().positive("User ID must be a positive integer"),
});

export type UserIdParamsDto = z.infer<typeof UserIdParamsDtoSchema>;

export interface GetUserByIdResponseDto {
	user: User;
	status: UserStatus | null;
	has_liked_you?: boolean;
	is_liked?: boolean;
	is_matched?: boolean;
}
