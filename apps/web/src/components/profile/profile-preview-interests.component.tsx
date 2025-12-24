import { Box, Typography, Stack, Chip } from "@mui/material";

interface ProfilePreviewInterestsProps {
  interests?: string[] | null;
}

export const ProfilePreviewInterests = ({
  interests,
}: ProfilePreviewInterestsProps) => {
  if (!interests || interests.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Interests
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {interests.map((interest, index) => (
          <Chip key={index} label={interest} size="small" color="primary" />
        ))}
      </Stack>
    </Box>
  );
};
