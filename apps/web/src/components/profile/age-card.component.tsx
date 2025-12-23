import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { ProfileFieldCard } from "./profile-field-card.component";

export function AgeCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const [age, setAge] = useState<number | "">(authUser?.age || "");
  const [validationError, setValidationError] = useState<string>("");

  const defaultValue = authUser?.age || "";
  const hasChanges = age !== defaultValue;

  useEffect(() => {
    if (authUser?.age !== null && authUser?.age !== undefined) {
      setAge(authUser.age);
    }
  }, [authUser?.age]);

  const handleChange = (value: string) => {
    if (value === "") {
      setAge("");
      setValidationError("");
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setValidationError("Please enter a valid number");
      return;
    }

    if (numValue < 18) {
      setValidationError("You must be at least 18 years old");
    } else if (numValue > 120) {
      setValidationError("Age must be realistic");
    } else {
      setValidationError("");
    }

    setAge(numValue);
  };

  const handleSave = async () => {
    if (typeof age === "number" && !validationError) {
      await updateProfile({ age });
    }
  };

  return (
    <ProfileFieldCard
      title="Age"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && !validationError}
      error={error}
    >
      <TextField
        type="number"
        label="Your age"
        value={age}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        fullWidth
        error={!!validationError}
        helperText={validationError}
        inputProps={{ min: 18, max: 120 }}
      />
    </ProfileFieldCard>
  );
}
