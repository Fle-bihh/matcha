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
  ResetPasswordRequestSchema,
  ResetPasswordRequestDto,
} from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function ModifyPasswordPage() {
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuthUser();
  const { isLoading, error, isSuccess } = useActions([
    EActionKeys.ResetPassword,
  ]);

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordRequestDto>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordRequestDto) => {
    await resetPassword(data);
  };

  if (!token) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CenteredPaper backButtonDisabled>
          <Alert severity="error">
            Invalid or missing reset token. Please request a new password reset
            link.
          </Alert>
        </CenteredPaper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CenteredPaper backButtonDisabled>
        <Typography
          variant="h4"
          component="h2"
          fontWeight={600}
          gutterBottom
          textAlign="center"
          mb={2}
        >
          Reset Your Password
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          Enter your new password below. Make sure it's strong and secure.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset successfully! Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register("password")}
              type="password"
              label="New Password"
              variant="outlined"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading || isSuccess}
            />
            <TextField
              {...register("confirmPassword")}
              type="password"
              label="Confirm New Password"
              variant="outlined"
              fullWidth
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading || isSuccess}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading || isSuccess}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </Stack>
        </Box>
      </CenteredPaper>
    </Box>
  );
}
