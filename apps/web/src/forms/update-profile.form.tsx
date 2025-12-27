import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateProfileDtoSchema,
  UpdateProfileDto,
  Gender,
} from "@matcha/shared";
import {
  Button,
  Stack,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useMemo } from "react";

export function UpdateProfileForm() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActionsData([EActionKeys.UpdateProfile]);

  const defaultValues = useMemo(
    () => ({
      gender: authUser?.gender || undefined,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    getFieldState,
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
        <FormControl error={!!errors.gender} disabled={isLoading}>
          <FormLabel id="gender-label">Gender</FormLabel>
          <Controller
            name="gender"
            control={control}
            defaultValue={defaultValues.gender}
            render={({ field }) => (
              <RadioGroup aria-labelledby="gender-label" {...field}>
                <FormControlLabel
                  value={Gender.Male}
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value={Gender.Female}
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value={Gender.Other}
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            )}
          />
          {errors.gender && (
            <FormHelperText>{errors.gender.message}</FormHelperText>
          )}
        </FormControl>

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
