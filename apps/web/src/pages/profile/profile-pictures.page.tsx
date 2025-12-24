import { Box } from "@mui/material";
import { useRef } from "react";
import { EActionKeys } from "@/types/actions.types";
import { useActions } from "@/hooks/actions.hooks";
import { useAuthUser } from "@/hooks/auth.hook";
import { MainPictureSection } from "@/components/profile/main-picture-section.component";
import { AdditionalPicturesSection } from "@/components/profile/additional-pictures-section.component";
import { ProfilePageWrapper } from "@/components/profile/profile-page-wrapper.component";

export const ProfilePicturesPage = () => {
  const { authUser, updateProfilePicture } = useAuthUser();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isLoading } = useActions([EActionKeys.UpdateProfilePicture]);

  const pictures = authUser?.pictures_urls || [];

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
    <ProfilePageWrapper
      title="Profile Pictures"
      description="You can upload up to 5 pictures. The first one will be your main profile picture and will be displayed more prominently."
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <MainPictureSection
          pictureUrl={pictures[0]}
          isLoading={isLoading}
          onFileSelect={handleFileSelect}
          fileInputRef={(el) => {
            fileInputRefs.current[0] = el;
          }}
          onClick={() => handleBoxClick(0)}
        />

        <AdditionalPicturesSection
          pictures={pictures}
          isLoading={isLoading}
          onFileSelect={handleFileSelect}
          fileInputRefs={(index) => (el) => {
            fileInputRefs.current[index] = el;
          }}
          onBoxClick={handleBoxClick}
        />
      </Box>
    </ProfilePageWrapper>
  );
};
