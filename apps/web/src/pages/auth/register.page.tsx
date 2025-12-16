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

export function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="98vh"
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
              Register
            </Typography>
            <Box component="form">
              <Stack spacing={2}>
                <TextField
                  type="text"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  type="email"
                  label="Email"
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
                    Register
                  </Button>
                  <Button
                    to={ROUTES.login}
                    variant="text"
                    fullWidth
                    component={Link}
                  >
                    Already have an account? Login
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
