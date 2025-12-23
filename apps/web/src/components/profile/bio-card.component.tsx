import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { ProfileFieldCard } from "./profile-field-card.component";

export function BioCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const [bio, setBio] = useState<string>(authUser?.bio || "");
  const [validationError, setValidationError] = useState<string>("");

  const defaultValue = authUser?.bio || "";
  const hasChanges = bio !== defaultValue;

  useEffect(() => {
    if (authUser?.bio !== null && authUser?.bio !== undefined) {
      setBio(authUser.bio);
    }
  }, [authUser?.bio]);

  const handleChange = (value: string) => {
    if (value.length > 500) {
      setValidationError("Bio must not exceed 500 characters");
    } else {
      setValidationError("");
    }
    setBio(value);
  };

  const handleSave = async () => {
    if (!validationError) {
      await updateProfile({ bio: bio || undefined });
    }
  };

  return (
    <ProfileFieldCard
      title="Bio"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && !validationError}
      error={error}
    >
      <TextField
        label="Tell us about yourself"
        value={bio}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        fullWidth
        multiline
        rows={4}
        error={!!validationError}
        helperText={validationError || `${bio.length}/500 characters`}
      />
    </ProfileFieldCard>
  );
}
