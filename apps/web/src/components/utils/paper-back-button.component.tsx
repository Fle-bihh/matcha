import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export function PaperBackButton() {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      variant="text"
      size="large"
      sx={{ mt: 2, ml: 2 }}
      onClick={() => navigate(-1)}
    />
  );
}
