import { CenteredPaper } from "@/components/app/centered-paper.component";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordRequestSchema,
  ForgotPasswordRequestDto,
} from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/constants";

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuthUser();
  const { isLoading, error, isSuccess } = useActions([
    EActionKeys.ForgotPassword,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordRequestDto>({
    resolver: zodResolver(ForgotPasswordRequestSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordRequestDto) => {
    await forgotPassword(data);
    reset();
  };

  return (
    <CenteredPaper>
      <Typography
        variant="h4"
        component="h2"
        fontWeight={600}
        gutterBottom
        textAlign="center"
        mb={2}
      >
        Forgot Password
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Enter your email address and we'll send you a link to reset your
        password.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <Link
                to={APP_ROUTES.login}
                style={{ color: "inherit", fontWeight: 600 }}
              >
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </CenteredPaper>
  );
}
