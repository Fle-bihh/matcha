import { CenteredPaper } from "@/components/app/centered-paper.component";
import { ROUTES } from "@/constants";
import { APP_NAME } from "@matcha/shared";
import {
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export function EntryPage() {
  return (
    <CenteredPaper backButtonDisabled>
      <Box p={5}>
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            gutterBottom
            color="primary"
          >
            Welcome to {APP_NAME}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>
        <Stack spacing={1.5}>
          <Button
            component={Link}
            to={ROUTES.register}
            variant="contained"
            size="large"
            color="primary"
            fullWidth
          >
            Register
          </Button>
          <Button
            component={Link}
            to={ROUTES.login}
            variant="outlined"
            size="large"
            color="primary"
            fullWidth
          >
            Login
          </Button>
        </Stack>
      </Box>
    </CenteredPaper>
  );
}
