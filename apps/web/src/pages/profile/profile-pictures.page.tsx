import { Box, Paper, IconButton, CircularProgress } from "@mui/material";
import { AddPhotoAlternate, Delete } from "@mui/icons-material";
import { useRef } from "react";
import { EActionKeys } from "@/types/actions.types";
import { useActions } from "@/hooks/actions.hooks";
import { useAuthUser } from "@/hooks/auth.hook";
import { AuthImage } from "@/components/utils/auth-image.component";

export const ProfilePicturesPage = () => {
  const { authUser, updateProfilePicture } = useAuthUser();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isLoading } = useActions([EActionKeys.UpdateProfilePicture]);

  const pictures = authUser?.pictures_urls || [];
  const maxPictures = 5;

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const indexString = index.toString();

    if (!file.type.startsWith("image/")) {
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return;
    }

    await updateProfilePicture({ file, index: indexString });

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const handleBoxClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          maxWidth: 1200,
        }}
      >
        {Array.from({ length: maxPictures }).map((_, index) => {
          const pictureUrl = pictures[index];
          const hasImage = Boolean(pictureUrl);

          return (
            <Paper
              key={index}
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
              onClick={() => !isLoading && handleBoxClick(index)}
              elevation={hasImage ? 0 : 1}
            >
              <input
                ref={(el) => {
                  fileInputRefs.current[index] = el;
                }}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, index)}
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
                  <Box sx={{ fontSize: 14 }}>Add Photo</Box>
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
