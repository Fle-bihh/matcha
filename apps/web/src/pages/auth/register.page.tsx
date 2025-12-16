import { ROUTES } from "@/constants";
import { Container, Box, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/forms/register.form";

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
            <RegisterForm />
            <Box mt={2}>
              <Button
                to={ROUTES.login}
                variant="text"
                fullWidth
                component={Link}
              >
                Already have an account? Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
