import { TextField } from "@mui/material";
import { fields } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useValidatedField } from "@/hooks/use-validated-field.hook";
import { ProfileFieldCard } from "./profile-field-card.component";

export function FirstNameCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActionsData([EActionKeys.UpdateProfile]);

  const {
    value: firstName,
    validationError,
    handleChange,
    isValid,
    hasChanges,
  } = useValidatedField({
    initialValue: "",
    schema: fields.firstName,
    syncWithAuth: authUser?.first_name,
  });

  const handleSave = async () => {
    if (isValid && firstName.trim()) {
      updateProfile({ first_name: firstName.trim() });
    }
  };

  return (
    <ProfileFieldCard
      title="First Name"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && isValid}
      error={error}
    >
      <TextField
        label="Your first name"
        value={firstName}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        fullWidth
        error={!!validationError}
        helperText={validationError || `${firstName.length}/50 characters`}
      />
    </ProfileFieldCard>
  );
}
