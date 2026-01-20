import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	TextField,
} from "@mui/material";
import { ChangeEmailDialog, ProfilePageWrapper } from "@/components";
import { useActionsData, useAuthUser, useFlagger } from "@/hooks";
import { EFlaggers } from "@/constants";
import { ResetPasswordForm } from "@/forms";
import { EActionKeys } from "@/types";

export function ProfileSettingsPage() {
	const { authUser, forgotPassword } = useAuthUser();
	const { setFlagger } = useFlagger(EFlaggers.ChangeEmailDialog);
	const { isLoading } = useActionsData([EActionKeys.ForgotPassword]);

	const handleChangeEmail = () => {
		setFlagger({ isOpen: true });
	};

	const handleResetPassword = () => {
		forgotPassword({ email: authUser?.email || "" });
	};

	return (
		<ProfilePageWrapper
			title="Settings"
			description="Manage your account preferences and privacy settings."
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						md: "repeat(2, 1fr)",
					},
					gap: 3,
				}}
			>
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Account Information
						</Typography>

						<Box sx={{ mb: 3 }}>
							<TextField
								label="Username"
								value={authUser?.username || ""}
								disabled
								fullWidth
								slotProps={{
									input: {
										readOnly: true,
									},
								}}
								helperText="Username cannot be changed"
							/>
						</Box>

						<Box sx={{ mb: 2 }}>
							<TextField
								label="Email"
								value={authUser?.email || ""}
								disabled
								fullWidth
								slotProps={{
									input: {
										readOnly: true,
									},
								}}
							/>
						</Box>

						<Button
							variant="outlined"
							onClick={handleChangeEmail}
							fullWidth
						>
							Change Email
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Password Reset
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mb: 3 }}
						>
							Request a password reset link to be sent to your
							email.
						</Typography>

						<Button
							variant="contained"
							color="primary"
							size="large"
							fullWidth
							disabled={isLoading}
							onClick={handleResetPassword}
						>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</Button>
					</CardContent>
				</Card>
			</Box>

			<ChangeEmailDialog />
		</ProfilePageWrapper>
	);
}
