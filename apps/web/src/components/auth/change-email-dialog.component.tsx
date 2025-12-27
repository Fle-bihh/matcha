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

export function ChangeEmailDialog() {
  const [newEmail, setNewEmail] = useState("");
  const { isOpen, closeFlagger } = useFlagger(EFlaggers.ChangeEmailDialog);

  const handleSend = () => {
    console.log("Send verification to:", newEmail);
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
          <Alert severity="info" sx={{ mb: 3 }}>
            To change your email address, you'll need to verify both your
            current and new email addresses. We'll send verification links to
            both emails before the change takes effect.
          </Alert>

          <TextField
            label="New Email Address"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
            placeholder="Enter your new email"
            autoFocus
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!newEmail || !newEmail.includes("@")}
        >
          Send Verification
        </Button>
      </DialogActions>
    </Dialog>
  );
}
