import { CenteredPaper } from "@/components/app/centered-paper.component";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useSearchParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouting } from "@/hooks/routing.hooks";
import { APP_ROUTES } from "@/constants";

export function ConfirmEmailChangePage() {
  const [searchParams] = useSearchParams();
  const router = useRouting();
  const { changeEmail } = useAuthUser();
  const { isLoading, error, isSuccess } = useActions([EActionKeys.ChangeEmail]);

  const token = searchParams.get("token");

  const handleChangeEmail = async () => {
    if (!token) return;

    await changeEmail({ token });
  };

  const handleManualClose = () => {
    window.close();
    setTimeout(() => {
      router.replace(APP_ROUTES.login);
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
          Confirm Email Change
        </Typography>

        {isSuccess ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom color="success.main">
              Email Changed Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your email address has been updated. You can now close this
              window.
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
        ) : (
          <>
            <Typography
              variant="body1"
              textAlign="center"
              mb={3}
              color="text.secondary"
            >
              Click the button below to confirm your new email address and
              complete the email change.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleChangeEmail}
              disabled={isLoading || !token}
            >
              {isLoading ? "Confirming..." : "Confirm Email Change"}
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
