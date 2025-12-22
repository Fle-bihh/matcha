import { Box, Paper, SxProps } from "@mui/material";
import { ReactNode } from "react";
import { PaperBackButton } from "../utils/paper-back-button.component";

interface CenteredPaperProps {
  backButtonDisabled?: boolean;
  sx?: SxProps;
  boxSx?: SxProps;
  children?: ReactNode;
}
export function CenteredPaper(props: CenteredPaperProps) {
  return (
    <Box sx={props.boxSx}>
      <Paper elevation={4} sx={{ borderRadius: 2, minWidth: "50vw", m: 4 }}>
        {!props.backButtonDisabled && <PaperBackButton />}
        <Box p={5} sx={props.sx}>
          <>{props.children}</>
        </Box>
      </Paper>
    </Box>
  );
}
