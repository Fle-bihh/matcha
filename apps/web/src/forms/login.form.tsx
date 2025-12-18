import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema, LoginRequestDto } from "@matcha/shared";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { ROUTES } from "@/constants";
import { Link } from "react-router-dom";

export function LoginForm() {
	const { login } = useAuthUser();
	const { isLoading, error } = useActions([EActionKeys.Login]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginRequestDto>({
		resolver: zodResolver(LoginRequestSchema),
		mode: "onBlur",
	});

	const onSubmit = async (data: LoginRequestDto) => {
		await login(data);
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
				<Box>
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
						to={ROUTES.forgotPassword}
						variant="text"
						fullWidth
						component={Link}
					>
						Forgot Password?
					</Button>
				</Box>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					size="large"
					fullWidth
					disabled={isLoading}
				>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
				{error && (
					<Typography
						color="error"
						variant="body2"
						textAlign="center"
					>
						{error}
					</Typography>
				)}
			</Stack>
		</form>
	);
}
