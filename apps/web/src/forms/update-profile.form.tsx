import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateProfileDtoSchema,
  UpdateProfileDto,
  Gender,
} from "@matcha/shared";
import { TextField, Button, Stack, Typography, MenuItem } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useMemo } from "react";

export function UpdateProfileForm() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const defaultValues = useMemo(
    () => ({
      gender: authUser?.gender || "",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileDto>({
    resolver: zodResolver(UpdateProfileDtoSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: UpdateProfileDto) => {
    await updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          {...register("gender")}
          select
          label="Gender"
          variant="outlined"
          fullWidth
          required
          error={!!errors.gender}
          helperText={errors.gender?.message}
          disabled={isLoading}
          defaultValue={defaultValues.gender}
        >
          <MenuItem value={Gender.Male}>Male</MenuItem>
          <MenuItem value={Gender.Female}>Female</MenuItem>
          <MenuItem value={Gender.Other}>Other</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}
      </Stack>
    </form>
  );
}
