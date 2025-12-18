import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouting } from "@/hooks/routing.hooks";

export function PaperBackButton() {
  const { goBack } = useRouting();
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      variant="text"
      size="large"
      sx={{ mt: 2, ml: 2, borderRadius: 999 }}
      onClick={goBack}
    />
  );
}
