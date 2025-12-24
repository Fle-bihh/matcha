import { Box, Typography } from "@mui/material";
import { ProfilePictureBox } from "./profile-picture-box.component";

interface AdditionalPicturesSectionProps {
  pictures: (string | undefined)[];
  isLoading: boolean;
  onFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fileInputRefs: (index: number) => (el: HTMLInputElement | null) => void;
  onBoxClick: (index: number) => void;
}

export const AdditionalPicturesSection = ({
  pictures,
  isLoading,
  onFileSelect,
  fileInputRefs,
  onBoxClick,
}: AdditionalPicturesSectionProps) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight={500}>
        Additional Pictures
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const index = i + 1;
          return (
            <ProfilePictureBox
              key={index}
              pictureUrl={pictures[index]}
              index={index}
              isLoading={isLoading}
              onFileSelect={onFileSelect}
              fileInputRef={fileInputRefs(index)}
              onClick={() => onBoxClick(index)}
            />
          );
        })}
      </Box>
    </Box>
  );
};
