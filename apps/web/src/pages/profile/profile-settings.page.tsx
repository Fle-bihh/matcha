import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

export function ProfileSettingsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card sx={{ maxWidth: 600, mt: 3 }}>
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
  );
}
