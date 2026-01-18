import { CenteredPaper } from "@/components";
import { VerifyEmailBox } from "@/components/home/verify-email-box.component";
import { Box, Button, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useRouting } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import { withEmailVerifiedComponent } from "@/utils";

function ProfileUncompleteComp() {
	const routing = useRouting();

	const handleCompleteProfile = () => {
		routing.push(APP_ROUTES.profile);
	};
	return (
		<CenteredPaper backButtonDisabled sx={{ textAlign: "center" }}>
			<PersonOutlineIcon
				sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
			/>
			<Typography variant="h4" gutterBottom>
				Profile Incomplete
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				gutterBottom
				sx={{ mb: 3 }}
			>
				Please complete your profile to access all app features.
			</Typography>
			<Button
				variant="contained"
				size="large"
				fullWidth
				onClick={handleCompleteProfile}
			>
				Complete Profile
			</Button>
		</CenteredPaper>
	);
}

export const ProfileUncomplete = withEmailVerifiedComponent(
	ProfileUncompleteComp,
	VerifyEmailBox,
);
