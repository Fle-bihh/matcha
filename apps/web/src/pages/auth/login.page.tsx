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
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={4}>
          <Box p={5}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={600}
              gutterBottom
              textAlign="center"
              mb={4}
            >
              Login
            </Typography>
            <Box component="form">
              <Stack spacing={3}>
                <TextField
                  type="text"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  type="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  required
                />

                <Stack spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Login
                  </Button>
                  <Button
                    to={ROUTES.register}
                    variant="text"
                    fullWidth
                    component={Link}
                  >
                    Don't have an account? Register
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
