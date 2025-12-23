import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { Gender } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { useValidatedField } from "@/hooks/use-validated-field.hook";
import { ProfileFieldCard } from "./profile-field-card.component";

export function GenderCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const {
    value: gender,
    handleChange,
    hasChanges,
  } = useValidatedField<Gender | undefined>({
    initialValue: undefined,
    syncWithAuth: authUser?.gender,
  });

  const handleSave = async () => {
    if (gender) {
      await updateProfile({ gender });
    }
  };

  return (
    <ProfileFieldCard
      title="Gender"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges}
      error={error}
    >
      <FormControl disabled={isLoading}>
        <FormLabel id="gender-label">Select your gender</FormLabel>
        <RadioGroup
          aria-labelledby="gender-label"
          value={gender || ""}
          onChange={(e) => handleChange(e.target.value as Gender)}
        >
          <FormControlLabel
            value={Gender.Male}
            control={<Radio />}
            label="Male"
          />
          <FormControlLabel
            value={Gender.Female}
            control={<Radio />}
            label="Female"
          />
          <FormControlLabel
            value={Gender.Other}
            control={<Radio />}
            label="Other"
          />
        </RadioGroup>
      </FormControl>
    </ProfileFieldCard>
  );
}
