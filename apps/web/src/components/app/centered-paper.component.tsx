import { Box, Paper } from "@mui/material";
import { ReactNode } from "react";
import { PaperBackButton } from "../utils/paper-back-button.component";

interface CenteredPaperProps {
  backButtonDisabled?: boolean;
  sx?: object;
  children?: ReactNode;
}
export function CenteredPaper(props: CenteredPaperProps) {
  return (
    <Box>
      <Paper elevation={4} sx={{ borderRadius: 2, minWidth: "50vw", m: 4 }}>
        {!props.backButtonDisabled && <PaperBackButton />}
        <Box p={5} sx={props.sx}>
          <>{props.children}</>
        </Box>
      </Paper>
    </Box>
  );
}
