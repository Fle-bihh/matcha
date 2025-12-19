import { CenteredPaper } from "@/components/app/centered-paper.component";
import { Container, Box, Paper, Typography } from "@mui/material";

export function ConfirmEmailPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CenteredPaper backButtonDisabled>
        <Typography
          variant="h4"
          component="h2"
          fontWeight={600}
          gutterBottom
          textAlign="center"
          mb={2}
        >
          Confirm Your Email
        </Typography>
      </CenteredPaper>
    </Box>
  );
}
