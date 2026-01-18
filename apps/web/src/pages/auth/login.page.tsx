import { APP_ROUTES } from "@/constants";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { LoginForm } from "@/forms";
import { CenteredPaper } from "@/components";

export function LoginPage() {
  return (
    <CenteredPaper>
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
          to={APP_ROUTES.register}
          variant="text"
          fullWidth
          component={Link}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </CenteredPaper>
  );
}
