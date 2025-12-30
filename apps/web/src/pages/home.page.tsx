import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import { withProfileCompleteComponent } from "@/components/utils/with-condition-component.component";
import { ProfileUncomplete } from "./profile-uncomplete.page";
import { usePager } from "@/hooks/pagination.hook";
import { EPagerKeys } from "@/constants";
import { User } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { EEntityTypes } from "@/types";

function HomePageComp() {
  const { getUsers } = useAuthUser();
  const { data: users, meta } = usePager<User>({
    pagerKey: EPagerKeys.Users,
    entityType: EEntityTypes.Users,
    fn: getUsers,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Users
        </Typography>
        {meta && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Page {meta.page} of {meta.totalPages} | Total: {meta.total} users
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {users.map((user: User) => (
          <Card key={user.id}>
            <CardContent>
              <Typography variant="h6">
                {user.first_name} {user.last_name}
              </Typography>
              {user.bio && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {user.bio}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {!users.length && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No users found.
        </Typography>
      )}
    </Container>
  );
}

export const HomePage = withProfileCompleteComponent(
  HomePageComp,
  ProfileUncomplete
);
