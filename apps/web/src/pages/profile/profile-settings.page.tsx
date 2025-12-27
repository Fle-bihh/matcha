import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { ProfilePageWrapper } from "@/components/profile/profile-page-wrapper.component";
import { useAuthUser } from "@/hooks/auth.hook";
import { ChangeEmailDialog } from "@/components/auth/change-email-dialog.component";
import { useFlagger } from "@/hooks/flaggers.hook";
import { EFlaggers } from "@/constants/flaggers.constants";

export function ProfileSettingsPage() {
  const { authUser } = useAuthUser();
  const { openFlagger } = useFlagger(EFlaggers.ChangeEmailDialog);

  const handleChangeEmail = () => {
    openFlagger();
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

            <Button variant="outlined" onClick={handleChangeEmail} fullWidth>
              Change Email
            </Button>
          </CardContent>
        </Card>
      </Box>

      <ChangeEmailDialog />
    </ProfilePageWrapper>
  );
}
