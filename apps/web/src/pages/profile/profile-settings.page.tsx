import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header.component";

export function ProfileSettingsPage() {
  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <ProfileSectionHeader
        title="Settings"
        description="Manage your account preferences and privacy settings."
      />

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
    </Box>
  );
}
