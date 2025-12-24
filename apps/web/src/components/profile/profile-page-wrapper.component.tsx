import { Box } from "@mui/material";
import { ReactNode } from "react";
import { ProfileSectionHeader } from "./profile-section-header.component";

interface ProfilePageWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const ProfilePageWrapper = ({
  children,
  title,
  description,
}: ProfilePageWrapperProps) => {
  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <ProfileSectionHeader title={title} description={description} />
      <>{children}</>
    </Box>
  );
};
