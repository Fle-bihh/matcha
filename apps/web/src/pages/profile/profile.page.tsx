import { Box } from "@mui/material";
import { ProfilePageWrapper } from "@/components";
import { FirstNameCard } from "@/components";
import { LastNameCard } from "@/components";
import { GenderCard } from "@/components";
import { OrientationCard } from "@/components";
import { AgeCard } from "@/components";
import { BioCard } from "@/components";

export function ProfilePage() {
  return (
    <ProfilePageWrapper
      title="Profile Information"
      description="Update your personal information. This data will be used to help you find better matches."
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 3,
        }}
      >
        <FirstNameCard />
        <LastNameCard />
        <GenderCard />
        <OrientationCard />
        <AgeCard />
        <BioCard />
      </Box>
    </ProfilePageWrapper>
  );
}
