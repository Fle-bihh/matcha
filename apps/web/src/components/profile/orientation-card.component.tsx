import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Orientation } from "@matcha/shared";
import { useAuthUser } from "@/hooks/auth.hook";
import { useActions } from "@/hooks/actions.hooks";
import { EActionKeys } from "@/types/actions.types";
import { ProfileFieldCard } from "./profile-field-card.component";

export function OrientationCard() {
  const { authUser, updateProfile } = useAuthUser();
  const { isLoading, error } = useActions([EActionKeys.UpdateProfile]);

  const [orientation, setOrientation] = useState<Orientation | undefined>(
    authUser?.orientation || undefined
  );

  const defaultValue = authUser?.orientation || undefined;
  const hasChanges = orientation !== defaultValue;

  useEffect(() => {
    if (authUser?.orientation) {
      setOrientation(authUser.orientation);
    }
  }, [authUser?.orientation]);

  const handleSave = async () => {
    if (orientation) {
      await updateProfile({ orientation });
    }
  };

  return (
    <ProfileFieldCard
      title="Sexual Orientation"
      onSave={handleSave}
      isLoading={isLoading}
      hasChanges={hasChanges}
      error={error}
    >
      <FormControl disabled={isLoading}>
        <FormLabel id="orientation-label">Select your orientation</FormLabel>
        <RadioGroup
          aria-labelledby="orientation-label"
          value={orientation || ""}
          onChange={(e) => setOrientation(e.target.value as Orientation)}
        >
          <FormControlLabel
            value={Orientation.Heterosexual}
            control={<Radio />}
            label="Heterosexual"
          />
          <FormControlLabel
            value={Orientation.Homosexual}
            control={<Radio />}
            label="Homosexual"
          />
          <FormControlLabel
            value={Orientation.Bisexual}
            control={<Radio />}
            label="Bisexual"
          />
        </RadioGroup>
      </FormControl>
    </ProfileFieldCard>
  );
}
