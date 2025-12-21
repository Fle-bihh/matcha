import { Alert, Snackbar as MuiSnackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "@/store";
import { TRootState } from "@/types";

export function Snackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: TRootState) => state.snackbar
  );

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
