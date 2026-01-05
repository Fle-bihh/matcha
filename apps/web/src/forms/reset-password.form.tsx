import { Box, TextField, Button, Stack, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ForgotPasswordRequestSchema,
	ForgotPasswordRequestDto,
} from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";

interface ResetPasswordFormProps {
	showError?: boolean;
}

export function ResetPasswordForm({
	showError = true,
}: ResetPasswordFormProps) {
	const { forgotPassword } = useAuthUser();
	const { isLoading, error } = useActionsData([EActionKeys.ForgotPassword]);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<ForgotPasswordRequestDto>({
		resolver: zodResolver(ForgotPasswordRequestSchema),
		mode: "all",
	});

	const onSubmit = async (data: ForgotPasswordRequestDto) => {
		forgotPassword(data);
		reset();
	};

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{showError && error && <Alert severity="error">{error}</Alert>}

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
					disabled={isLoading || !isValid}
				>
					{isLoading ? "Sending..." : "Send Reset Link"}
				</Button>
			</Stack>
		</Box>
	);
}
