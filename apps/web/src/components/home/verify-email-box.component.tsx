import { useAuthUser } from "@/hooks/auth.hook";
import { Alert, Typography, Button } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { withEmailNotVerifiedComponent } from "../utils/with-condition-component.component";

function VerifyEmailBoxComp() {
  const { resendVerificationEmail } = useAuthUser();

  const handleResendEmail = () => {
    resendVerificationEmail();
  };

  return (
    <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
      <Typography variant="body1" fontWeight="bold" gutterBottom>
        Email Not Verified
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        You cannot use app features until you verify your email address. Please
        check your inbox for a verification link.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleResendEmail}
      >
        Resend Verification Email
      </Button>
    </Alert>
  );
}

export const VerifyEmailBox = withEmailNotVerifiedComponent(VerifyEmailBoxComp);
