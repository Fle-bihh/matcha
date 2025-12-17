import { PaperBackButton } from "@/components/utils/paper-back-button.component";
import { ROUTES } from "@/constants";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="98vh"
      >
        <Paper elevation={4}>
          <PaperBackButton />
          <Box p={5}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={600}
              gutterBottom
              textAlign="center"
              mb={2}
            >
              Forgot Password
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={4}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </Typography>
            <Box component="form">
              <Stack spacing={3}>
                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Send Reset Link
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
