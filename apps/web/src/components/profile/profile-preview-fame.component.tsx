import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ProfilePreviewFameProps {
  fameScore: number;
}

export const ProfilePreviewFame = ({ fameScore }: ProfilePreviewFameProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <FavoriteIcon sx={{ mr: 0.5, fontSize: 20, color: "error.main" }} />
      <Typography variant="body2" color="text.secondary">
        Fame Score: {fameScore}
      </Typography>
    </Box>
  );
};
