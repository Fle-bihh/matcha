import { Box, Typography } from "@mui/material";

export const ProfilePicturesHeader = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Profile Pictures
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You can upload up to 5 pictures. The first one will be your main profile
        picture and will be displayed more prominently.
      </Typography>
    </Box>
  );
};
