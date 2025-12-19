import { useAuthUser } from "@/hooks/auth.hook";
import {
  Container,
  Paper,
  Typography,
  Alert,
  Box,
  Button,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

export function HomePage() {
  const { logout, authUser } = useAuthUser();

  if (!authUser) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Welcome, {authUser.first_name}!
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {!authUser.is_email_verified && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Email Not Verified
            </Typography>
            <Typography variant="body2">
              You cannot use app features until you verify your email address.
              Please check your inbox for a verification link.
            </Typography>
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PersonIcon sx={{ mr: 1 }} /> User Information
          </Typography>

          <Box sx={{ ml: 2, mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Username:</strong> {authUser.username}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {authUser.email}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>First Name:</strong> {authUser.first_name}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Last Name:</strong> {authUser.last_name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" color="primary" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
