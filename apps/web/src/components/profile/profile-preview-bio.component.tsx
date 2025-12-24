import { Typography } from "@mui/material";

interface ProfilePreviewBioProps {
  bio?: string | null;
}

export const ProfilePreviewBio = ({ bio }: ProfilePreviewBioProps) => {
  if (!bio) return null;

  return (
    <Typography variant="body1" color="text.primary" sx={{ mb: 2, mt: 2 }}>
      {bio}
    </Typography>
  );
};
