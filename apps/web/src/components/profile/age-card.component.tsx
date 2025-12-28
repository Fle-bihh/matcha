import { TextField } from "@mui/material";
import { fields } from "@matcha/shared";
import { literal, z } from "zod";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActionsData } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useValidatedField } from "@/hooks/use-validated-field.hook";
import { ProfileFieldCard } from "./profile-field-card.component";

export function AgeCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActionsData([EActionKeys.UpdateProfile]);

  const {
    value: age,
    validationError,
    handleChange: setAgeValue,
    isValid,
    hasChanges,
  } = useValidatedField<number | "">({
    initialValue: 18,
    schema: fields.age.or(literal("")),
    syncWithAuth: authUser?.age ?? "",
    additionalValidation: (val) => {
      if (val === "") {
        return "Age is required";
      }
      return null;
    },
  });

  const handleChange = (value: string) => {
    if (value === "") {
      setAgeValue("");
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setAgeValue(numValue);
      }
    }
  };

  const handleSave = async () => {
    if (typeof age === "number" && isValid) {
      updateProfile({ age });
    }
  };

  return (
    <ProfileFieldCard
      title="Age"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges && isValid}
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
