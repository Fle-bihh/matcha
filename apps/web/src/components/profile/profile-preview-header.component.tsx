import { Box, Typography } from "@mui/material";

export const ProfilePreviewHeader = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Profile Preview
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This is how other users will see your profile. Make sure your
        information is accurate and appealing.
      </Typography>
    </Box>
  );
};
