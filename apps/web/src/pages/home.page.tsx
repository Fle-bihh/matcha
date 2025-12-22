import { useAuthUser } from "@/hooks/auth.hook";
import { Container, Typography, Box } from "@mui/material";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";

function HomePageComp() {
  const { authUser } = useAuthUser();

  if (!authUser) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Welcome, {authUser.first_name}!
        </Typography>
      </Box>
    </Container>
  );
}

export const HomePage = withProfileCompleteComponent(
  HomePageComp,
  ProfileUncomplete
);
