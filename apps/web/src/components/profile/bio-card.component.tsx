import { TextField } from "@mui/material";
import { validateBio } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useValidatedField } from "@/hooks/use-validated-field.hook";
import { ProfileFieldCard } from "./profile-field-card.component";

export function BioCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const {
    value: bio,
    validationError,
    handleChange,
    isValid,
    hasChanges,
  } = useValidatedField<string>({
    initialValue: "",
    validator: validateBio,
    syncWithAuth: authUser?.bio ?? "",
  });

  const handleSave = async () => {
    if (isValid) {
      await updateProfile({ bio: bio || undefined });
    }
  };

  return (
    <ProfileFieldCard
      title="Bio"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && isValid}
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
        helperText={
          validationError || `${(bio as string).length}/500 characters`
        }
      />
    </ProfileFieldCard>
  );
}
