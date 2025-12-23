import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { validateFirstName } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { ProfileFieldCard } from "./profile-field-card.component";

export function FirstNameCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const [firstName, setFirstName] = useState<string>(
    authUser?.first_name || ""
  );
  const [validationError, setValidationError] = useState<string>("");

  const defaultValue = authUser?.first_name || "";
  const hasChanges = firstName !== defaultValue;

  useEffect(() => {
    if (authUser?.first_name !== null && authUser?.first_name !== undefined) {
      setFirstName(authUser.first_name);
    }
  }, [authUser?.first_name]);

  const handleChange = (value: string) => {
    const error = validateFirstName(value);
    setValidationError(error || "");
    setFirstName(value);
  };

  const handleSave = async () => {
    if (!validationError && firstName.trim()) {
      await updateProfile({ first_name: firstName.trim() });
    }
  };

  return (
    <ProfileFieldCard
      title="First Name"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && !validationError}
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
