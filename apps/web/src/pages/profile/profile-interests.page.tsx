import { Box, Chip, Button } from "@mui/material";
import { ProfilePageWrapper } from "@/components/profile/profile-page-wrapper.component";
import { USER_INTERESTS, MAX_USER_INTERESTS } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useState, useEffect, useMemo } from "react";

export function ProfileInterestsPage() {
  const { authUser, updateProfile } = useAuthUser();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (authUser?.interests) {
      setSelectedInterests(authUser.interests);
    }
  }, [authUser?.interests]);

  const hasChanges = useMemo(() => {
    const current = [...selectedInterests].sort();
    const original = [...(authUser?.interests || [])].sort();

    if (current.length !== original.length) return true;
    return current.some((interest, index) => interest !== original[index]);
  }, [selectedInterests, authUser?.interests]);

  const handleInterestClick = (interest: string) => {
    setSelectedInterests((prev) => {
      const isSelected = prev.includes(interest);
      let newInterests: string[];

      if (isSelected) {
        newInterests = prev.filter((i) => i !== interest);
      } else if (prev.length < MAX_USER_INTERESTS) {
        newInterests = [...prev, interest];
      } else {
        return prev;
      }

      return newInterests;
    });
  };

  const handleSave = () => {
    if (authUser && hasChanges) {
      updateProfile({
        interests: selectedInterests,
      });
    }
  };

  const isMaxSelected = selectedInterests.length >= MAX_USER_INTERESTS;

  return (
    <ProfilePageWrapper
      title="Interests"
      description={`Select up to ${MAX_USER_INTERESTS} interests that represent you. This helps us find better matches for you.`}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mt: 2,
        }}
      >
        {USER_INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          const isDisabled = !isSelected && isMaxSelected;

          return (
            <Chip
              key={interest}
              label={interest.charAt(0).toUpperCase() + interest.slice(1)}
              onClick={() => handleInterestClick(interest)}
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              disabled={isDisabled}
              sx={{
                fontSize: "1rem",
                padding: "24px 12px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: isDisabled ? "none" : "scale(1.05)",
                },
                "&.MuiChip-colorDefault": {
                  borderColor: isDisabled ? "action.disabled" : "divider",
                  color: isDisabled ? "action.disabled" : "text.primary",
                },
              }}
            />
          );
        })}
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!hasChanges}
          sx={{
            minWidth: 120,
          }}
        >
          Save
        </Button>
      </Box>
    </ProfilePageWrapper>
  );
}
