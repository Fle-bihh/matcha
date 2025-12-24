import { CenteredPaper } from "@/components/app/centered-paper.component";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthUser();
  const { isLoading, error, isSuccess } = useActions([EActionKeys.VerifyEmail]);
  const [autoVerifying, setAutoVerifying] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token && window.opener && !window.opener.closed) {
      setAutoVerifying(true);
      handleVerifyEmail();
    }
  }, [token]);

  const handleVerifyEmail = async () => {
    if (!token) return;

    await verifyEmail({ token });
  };

  const handleManualClose = () => {
    window.close();
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

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
        <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
          Confirm Your Email
        </Typography>

        {isSuccess ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom color="success.main">
              Email Verified Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {window.opener && !window.opener.closed
                ? "Return to the previous tab to continue"
                : "You can now close this window"}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleManualClose}
            >
              Close Window
            </Button>
          </Box>
        ) : autoVerifying ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Verifying your email...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              variant="body1"
              textAlign="center"
              mb={3}
              color="text.secondary"
            >
              Click the button below to verify your email address and activate
              your account.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleVerifyEmail}
              disabled={isLoading || !token}
            >
              {isLoading ? "Verifying..." : "Confirm Email"}
            </Button>
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CenteredPaper>
    </Box>
  );
}
