import { Box, Card, CardContent, Typography, Chip, Stack } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { AuthImage } from "@/components/utils/auth-image.component";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export function ProfilePreviewPage() {
  const { authUser } = useAuthUser();

  if (!authUser) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const profilePictureUrl = authUser.pictures_urls?.[0];
  const displayName = `${authUser.first_name} ${authUser.last_name}`;

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <AuthImage
          src={profilePictureUrl}
          alt={`${displayName}'s profile picture`}
          height={400}
          width="100%"
          objectFit="cover"
          fallback={
            <Box
              sx={{
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey.300",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No photo
              </Typography>
            </Box>
          }
        />
        <CardContent>
          {/* Name and Age */}
          <Typography variant="h4" component="div" gutterBottom>
            {displayName}
            {authUser.age && (
              <Typography component="span" variant="h4" color="text.secondary">
                , {authUser.age}
              </Typography>
            )}
          </Typography>

          {/* Gender and Orientation */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {authUser.gender && (
              <Chip
                label={
                  authUser.gender.charAt(0).toUpperCase() +
                  authUser.gender.slice(1)
                }
                size="small"
                variant="outlined"
              />
            )}
            {authUser.orientation && (
              <Chip
                label={
                  authUser.orientation.charAt(0).toUpperCase() +
                  authUser.orientation.slice(1)
                }
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Location (placeholder for now) */}
          {authUser.location && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOnIcon
                sx={{ mr: 0.5, fontSize: 20, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                Location available
              </Typography>
            </Box>
          )}

          {/* Bio */}
          {authUser.bio && (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mb: 2, mt: 2 }}
            >
              {authUser.bio}
            </Typography>
          )}

          {/* Interests */}
          {(authUser.interests?.length ?? 0) > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Interests
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {authUser.interests?.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    color="primary"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Fame Score */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <FavoriteIcon sx={{ mr: 0.5, fontSize: 20, color: "error.main" }} />
            <Typography variant="body2" color="text.secondary">
              Fame Score: {authUser.fame_score}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
