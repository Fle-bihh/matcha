import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { ProfilePageWrapper } from "@/components/profile/profile-page-wrapper.component";

export function ProfileSettingsPage() {
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
        <Card sx={{}}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch />}
              label="Show profile to others"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable sound effects"
            />
          </CardContent>
        </Card>
      </Box>
    </ProfilePageWrapper>
  );
}
