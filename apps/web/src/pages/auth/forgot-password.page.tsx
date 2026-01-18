import { CenteredPaper } from "@/components";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import { ResetPasswordForm } from "@/forms";

export function ForgotPasswordPage() {
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

			<ResetPasswordForm />

			<Box textAlign="center" mt={3}>
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
		</CenteredPaper>
	);
}
