import { z } from "zod";
import { fields } from "../validation";
import { AuthUser } from "../models";

export const CreateUserDtoSchema = z.object({
  email: fields.email,
  username: fields.username,
  first_name: fields.firstName,
  last_name: fields.lastName,
  password: fields.password,
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z
  .object({
    email: fields.email.optional(),
    username: fields.username.optional(),
    first_name: fields.firstName.optional(),
    last_name: fields.lastName.optional(),
  })
  .partial();

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export interface UserResponseDto extends AuthUser {}
