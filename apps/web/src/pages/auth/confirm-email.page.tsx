import { CenteredPaper } from "@/components/app/centered-paper.component";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants";

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.VerifyEmail]);

  const token = searchParams.get("token");

  const handleVerifyEmail = async () => {
    if (!token) return;

    const result = await verifyEmail({ token });
    console.log("Verify email result:", result);
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
        <Typography
          variant="h4"
          component="h2"
          fontWeight={600}
          gutterBottom
          textAlign="center"
          mb={2}
        >
          Confirm Your Email
        </Typography>

        {/* {!success && !hasError && ( */}
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
        {/* )} */}

        {/* {!error && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Email verified successfully! Redirecting to home...
          </Alert>
        )} */}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CenteredPaper>
    </Box>
  );
}
