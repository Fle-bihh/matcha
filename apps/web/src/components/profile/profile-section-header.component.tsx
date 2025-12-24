import { Box, Typography } from "@mui/material";

interface ProfileSectionHeaderProps {
  title: string;
  description: string;
}

export const ProfileSectionHeader = ({
  title,
  description,
}: ProfileSectionHeaderProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};
