import { TextField } from "@mui/material";
import { fields } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useValidatedField } from "@/hooks/use-validated-field.hook";
import { ProfileFieldCard } from "./profile-field-card.component";

export function LastNameCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActionsData([EActionKeys.UpdateProfile]);

  const {
    value: lastName,
    validationError,
    handleChange,
    isValid,
    hasChanges,
  } = useValidatedField({
    initialValue: "",
    schema: fields.lastName,
    syncWithAuth: authUser?.last_name,
  });

  const handleSave = async () => {
    if (isValid && lastName.trim()) {
      updateProfile({ last_name: lastName.trim() });
    }
  };

  return (
    <ProfileFieldCard
      title="Last Name"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && isValid}
      error={error}
    >
      <TextField
        label="Your last name"
        value={lastName}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        fullWidth
        error={!!validationError}
        helperText={validationError || `${lastName.length}/50 characters`}
      />
    </ProfileFieldCard>
  );
}
