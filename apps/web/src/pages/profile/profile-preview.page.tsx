import { Box, Card, CardContent, Typography } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header.component";
import { ProfilePreviewImage } from "@/components/profile/profile-preview-image.component";
import { ProfilePreviewInfo } from "@/components/profile/profile-preview-info.component";
import { ProfilePreviewLocation } from "@/components/profile/profile-preview-location.component";
import { ProfilePreviewBio } from "@/components/profile/profile-preview-bio.component";
import { ProfilePreviewInterests } from "@/components/profile/profile-preview-interests.component";
import { ProfilePreviewFame } from "@/components/profile/profile-preview-fame.component";

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
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <ProfileSectionHeader
        title="Profile Preview"
        description="This is how other users will see your profile. Make sure your information is accurate and appealing."
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
            padding: 1,
          }}
        >
          <ProfilePreviewImage
            pictureUrl={profilePictureUrl}
            displayName={displayName}
          />

          <CardContent>
            <ProfilePreviewInfo
              displayName={displayName}
              age={authUser.age}
              gender={authUser.gender}
              orientation={authUser.orientation}
            />

            <ProfilePreviewLocation location={authUser.location} />

            <ProfilePreviewBio bio={authUser.bio} />

            <ProfilePreviewInterests interests={authUser.interests} />

            <ProfilePreviewFame fameScore={authUser.fame_score} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
