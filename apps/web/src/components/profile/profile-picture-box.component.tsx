import { Box, Paper, CircularProgress } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import { AuthImage } from "@/components";

interface ProfilePictureBoxProps {
  pictureUrl?: string;
  index: number;
  isMain?: boolean;
  isLoading: boolean;
  onFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onClick: () => void;
}

export const ProfilePictureBox = ({
  pictureUrl,
  index,
  isMain = false,
  isLoading,
  onFileSelect,
  fileInputRef,
  onClick,
}: ProfilePictureBoxProps) => {
  const hasImage = Boolean(pictureUrl);

  return (
    <Paper
      sx={{
        position: "relative",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isLoading ? "not-allowed" : "pointer",
        overflow: "hidden",
        bgcolor: hasImage ? "transparent" : "action.hover",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: hasImage ? "transparent" : "action.selected",
          transform: isLoading ? "none" : "scale(1.02)",
        },
      }}
      onClick={() => !isLoading && onClick()}
      elevation={hasImage ? 0 : 1}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFileSelect(e, index)}
        disabled={isLoading}
      />

      {isLoading ? (
        <CircularProgress size={40} />
      ) : hasImage ? (
        <>
          <AuthImage
            src={pictureUrl}
            alt={`Profile picture ${index + 1}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <AddPhotoAlternate sx={{ fontSize: 48, color: "white" }} />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <AddPhotoAlternate sx={{ fontSize: 48 }} />
          <Box sx={{ fontSize: 14 }}>
            {isMain ? "Add Main Photo" : "Add Photo"}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
