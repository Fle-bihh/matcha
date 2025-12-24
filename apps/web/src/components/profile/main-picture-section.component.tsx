import { Box, Typography } from "@mui/material";
import { ProfilePictureBox } from "./profile-picture-box.component";

interface MainPictureSectionProps {
  pictureUrl?: string;
  isLoading: boolean;
  onFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onClick: () => void;
}

export const MainPictureSection = ({
  pictureUrl,
  isLoading,
  onFileSelect,
  fileInputRef,
  onClick,
}: MainPictureSectionProps) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight={500}>
        Main Picture
      </Typography>
      <Box sx={{ maxWidth: 400 }}>
        <ProfilePictureBox
          pictureUrl={pictureUrl}
          index={0}
          isMain
          isLoading={isLoading}
          onFileSelect={onFileSelect}
          fileInputRef={fileInputRef}
          onClick={onClick}
        />
      </Box>
    </Box>
  );
};
