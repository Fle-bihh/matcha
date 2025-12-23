import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { validateLastName } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { ProfileFieldCard } from "./profile-field-card.component";

export function LastNameCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const [lastName, setLastName] = useState<string>(authUser?.last_name || "");
  const [validationError, setValidationError] = useState<string>("");

  const defaultValue = authUser?.last_name || "";
  const hasChanges = lastName !== defaultValue;

  useEffect(() => {
    if (authUser?.last_name !== null && authUser?.last_name !== undefined) {
      setLastName(authUser.last_name);
    }
  }, [authUser?.last_name]);

  const handleChange = (value: string) => {
    const error = validateLastName(value);
    setValidationError(error || "");
    setLastName(value);
  };

  const handleSave = async () => {
    if (!validationError && lastName.trim()) {
      await updateProfile({ last_name: lastName.trim() });
    }
  };

  return (
    <ProfileFieldCard
      title="Last Name"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && !validationError}
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
