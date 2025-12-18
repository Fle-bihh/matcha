import { Box, Paper } from "@mui/material";
import { PropsWithChildren } from "react";
import { PaperBackButton } from "../utils/paper-back-button.component";

interface CenteredPaperProps {
  backButtonDisabled?: boolean;
  sx?: object;
}
export function CenteredPaper(props: PropsWithChildren & CenteredPaperProps) {
  return (
    <Box>
      <Paper elevation={4} sx={{ borderRadius: 2, minWidth: "50vw", m: 4 }}>
        {!props.backButtonDisabled && <PaperBackButton />}
        <Box p={5} sx={props.sx}>
          {props.children}
        </Box>
      </Paper>
    </Box>
  );
}
