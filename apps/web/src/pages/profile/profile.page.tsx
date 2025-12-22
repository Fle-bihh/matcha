import { useAuthUser } from "@/hooks/auth.hook";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import { UpdateProfileForm } from "@/forms/update-profile.form";

export function ProfilePage() {
  const { authUser: user } = useAuthUser();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Card sx={{ maxWidth: 600, mt: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 2, bgcolor: "primary.main" }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{user?.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Update Gender
            </Typography>
            <UpdateProfileForm />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
