import { CenteredPaper } from "@/components/app/centered-paper.component";
import { Box, Button, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export function ProfileUncomplete() {
  return (
    <CenteredPaper
      backButtonDisabled
      boxSx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        height: "80%",
        alignItems: "center",
      }}
      sx={{ textAlign: "center" }}
    >
      <PersonOutlineIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Profile Incomplete
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Please complete your profile to access all app features.
      </Typography>
      <Button variant="contained" size="large" fullWidth>
        Complete Profile
      </Button>
    </CenteredPaper>
  );
}
