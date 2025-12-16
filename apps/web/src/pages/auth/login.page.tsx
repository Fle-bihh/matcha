import { ROUTES } from "@/constants";
import { Container, Box, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { LoginForm } from "@/forms/login.form";

export function LoginPage() {
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
              Login
            </Typography>
            <LoginForm />
            <Box mt={2}>
              <Button
                to={ROUTES.register}
                variant="text"
                fullWidth
                component={Link}
              >
                Don't have an account? Register
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
