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
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {interests.map((interest, index) => (
          <Chip
            key={index}
            label={`#${interest}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
  );
};
