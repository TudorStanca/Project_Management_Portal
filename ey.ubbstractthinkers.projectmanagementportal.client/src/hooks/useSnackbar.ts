import type { SnackbarSeverity } from "@models/SnackbarSeverity";
import { useState } from "react";

interface IUseSnackbar {
  showSnackbar: (message: string, snackbarSeverity: SnackbarSeverity) => void;
  isSnackbarOpen: boolean;
  message: string;
  snackbarSeverity: SnackbarSeverity;
  handleSnackbarClose: () => void;
}

const useSnackbar = (): IUseSnackbar => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
  };

  return {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  };
};

export default useSnackbar;
