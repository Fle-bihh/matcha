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
import { useFlagger } from "@/hooks/flaggers.hook";
import { EFlaggers } from "@/constants/flaggers.constants";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useForm } from "react-hook-form";
import {
  SendChangeEmailVerificationRequestDto,
  SendChangeEmailVerificationRequestSchema,
} from "@matcha/shared";
import { zodResolver } from "@hookform/resolvers/zod";

export function ChangeEmailDialog() {
  const { isOpen, closeFlagger } = useFlagger(EFlaggers.ChangeEmailDialog);
  const { sendChangeEmailVerification } = useAuthUser();
  const { isLoading, isSuccess } = useActions([
    EActionKeys.SendChangeEmailVerification,
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendChangeEmailVerificationRequestDto>({
    resolver: zodResolver(SendChangeEmailVerificationRequestSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SendChangeEmailVerificationRequestDto) => {
    await sendChangeEmailVerification(data);
  };

  const handleClose = () => {
    reset();
    closeFlagger();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Email Address</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  email address. We'll send a verification link to your new
                  email before the change takes effect.
                </Alert>

                <TextField
                  {...register("newEmail")}
                  label="New Email Address"
                  type="email"
                  fullWidth
                  placeholder="Enter your new email"
                  autoFocus
                  disabled={isLoading}
                  error={!!errors.newEmail}
                  helperText={errors.newEmail?.message}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} type="button">
            {isSuccess ? "Close" : "Cancel"}
          </Button>
          {!isSuccess && (
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification"}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
