import type { SnackbarSeverity } from "@models/SnackbarSeverity";
import { Alert, Snackbar } from "@mui/material";

interface CustomSnackbarProps {
  isOpen: boolean;
  message: string;
  snackbarSeverity: SnackbarSeverity;
  handleSnackbarClose: () => void;
}

const CustomSnackbar = (props: CustomSnackbarProps) => {
  return (
    <Snackbar
      open={props.isOpen}
      autoHideDuration={4000}
      onClose={props.handleSnackbarClose}
    >
      <Alert
        onClose={props.handleSnackbarClose}
        severity={props.snackbarSeverity}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
