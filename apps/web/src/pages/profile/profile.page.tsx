import { Box } from "@mui/material";
import { FirstNameCard } from "@/components/profile/first-name-card.component";
import { LastNameCard } from "@/components/profile/last-name-card.component";
import { GenderCard } from "@/components/profile/gender-card.component";
import { OrientationCard } from "@/components/profile/orientation-card.component";
import { AgeCard } from "@/components/profile/age-card.component";
import { BioCard } from "@/components/profile/bio-card.component";
import { ProfileSectionHeader } from "@/components/profile/profile-section-header.component";

export function ProfilePage() {
  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <ProfileSectionHeader
        title="Profile Information"
        description="Update your personal information. This data will be used to help you find better matches."
      />

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
    </Box>
  );
}
