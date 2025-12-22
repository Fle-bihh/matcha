import { APP_ROUTES } from "@/constants";
import { Box, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/forms/register.form";
import { PaperBackButton } from "@/components/utils/paper-back-button.component";
import { CenteredPaper } from "@/components/app/centered-paper.component";

export function RegisterPage() {
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
        Register
      </Typography>
      <RegisterForm />
      <Box mt={2}>
        <Button to={APP_ROUTES.login} variant="text" fullWidth component={Link}>
          Already have an account? Login
        </Button>
      </Box>
    </CenteredPaper>
  );
}
