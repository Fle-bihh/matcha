import { Typography, Stack, Chip } from "@mui/material";

interface ProfilePreviewInfoProps {
  displayName: string;
  age?: number | null;
  gender?: string | null;
  orientation?: string | null;
}

export const ProfilePreviewInfo = ({
  displayName,
  age,
  gender,
  orientation,
}: ProfilePreviewInfoProps) => {
  return (
    <>
      {/* Name and Age */}
      <Typography variant="h4" component="div" gutterBottom>
        {displayName}
        {age && (
          <Typography component="span" variant="h4" color="text.secondary">
            , {age}
          </Typography>
        )}
      </Typography>

      {/* Gender and Orientation */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {gender && (
          <Chip
            label={gender.charAt(0).toUpperCase() + gender.slice(1)}
            size="small"
            variant="outlined"
          />
        )}
        {orientation && (
          <Chip
            label={orientation.charAt(0).toUpperCase() + orientation.slice(1)}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>
    </>
  );
};
