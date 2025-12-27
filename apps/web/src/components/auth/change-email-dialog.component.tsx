import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useFlagger } from "@/hooks/flaggers.hook";
import { EFlaggers } from "@/constants/flaggers.constants";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";

export function ChangeEmailDialog() {
  const [newEmail, setNewEmail] = useState("");
  const { isOpen, closeFlagger } = useFlagger(EFlaggers.ChangeEmailDialog);
  const { sendChangeEmailVerification } = useAuthUser();
  const { isLoading, isSuccess } = useActions([
    EActionKeys.SendChangeEmailVerification,
  ]);

  const handleSend = async () => {
    await sendChangeEmailVerification({ newEmail });
  };

  const handleClose = () => {
    setNewEmail("");
    closeFlagger();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Email Address</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isSuccess ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Verification link sent! Please check your new email address and
              click the link to complete the email change.
            </Alert>
          ) : (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                To change your email address, you'll need to verify your new
                email address. We'll send a verification link to your new email
                before the change takes effect.
              </Alert>

              <TextField
                label="New Email Address"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                fullWidth
                placeholder="Enter your new email"
                autoFocus
                disabled={isLoading}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{isSuccess ? "Close" : "Cancel"}</Button>
        {!isSuccess && (
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!newEmail || !newEmail.includes("@") || isLoading}
          >
            {isLoading ? "Sending..." : "Send Verification"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
