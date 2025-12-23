import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
import { useAuthenticatedImage } from "@/hooks/use-authenticated-image.hook";

interface AuthImageProps {
  src: string | null | undefined;
  alt: string;
  height?: number | string;
  width?: number | string;
  sx?: SxProps<Theme>;
  fallback?: React.ReactNode;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export function AuthImage({
  src,
  alt,
  height,
  width,
  sx,
  fallback,
  objectFit = "cover",
}: AuthImageProps) {
  const { blobUrl, loading, error } = useAuthenticatedImage(src);

  if (loading) {
    return (
      <Box
        sx={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "grey.200",
          ...sx,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !blobUrl) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box
        sx={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "grey.300",
          ...sx,
        }}
      >
        {error?.message || "Failed to load image"}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={blobUrl}
      alt={alt}
      sx={{
        height,
        width,
        objectFit,
        ...sx,
      }}
    />
  );
}
