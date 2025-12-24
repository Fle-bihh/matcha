import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface ProfilePreviewLocationProps {
  location?: string | null;
}

export const ProfilePreviewLocation = ({
  location,
}: ProfilePreviewLocationProps) => {
  if (!location) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <LocationOnIcon sx={{ mr: 0.5, fontSize: 20, color: "text.secondary" }} />
      <Typography variant="body2" color="text.secondary">
        Location available
      </Typography>
    </Box>
  );
};
