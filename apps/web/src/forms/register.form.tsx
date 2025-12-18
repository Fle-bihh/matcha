import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequestSchema, RegisterRequestDto } from "@matcha/shared";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";

export function RegisterForm() {
  const { register: registerUser } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.Register]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequestDto>({
    resolver: zodResolver(RegisterRequestSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterRequestDto) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          {...register("username")}
          type="text"
          label="Username"
          variant="outlined"
          fullWidth
          required
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isLoading}
        />
        <TextField
          {...register("email")}
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isLoading}
        />
        <TextField
          {...register("first_name")}
          type="text"
          label="First Name"
          variant="outlined"
          fullWidth
          required
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          disabled={isLoading}
        />
        <TextField
          {...register("last_name")}
          type="text"
          label="Last Name"
          variant="outlined"
          fullWidth
          required
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          disabled={isLoading}
        />
        <TextField
          {...register("password")}
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          required
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
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
