import { CenteredPaper } from "@/components/app/centered-paper.component";
import { Box, Button, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useRouting } from "@/hooks/routing.hooks";
import { APP_ROUTES } from "@/constants";
import { withEmailVerifiedComponent } from "@/components/utils/with-condition-component.component";
import { VerifyEmailBox } from "@/components/home/verify-email-box.component";

function ProfileUncompleteComp() {
  const routing = useRouting();

  const handleCompleteProfile = () => {
    routing.push(APP_ROUTES.profile);
  };
  return (
    <CenteredPaper backButtonDisabled sx={{ textAlign: "center" }}>
      <PersonOutlineIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
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
  VerifyEmailBox
);
