import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import styles from "./LoginPage.module.css";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import AuthBackground from "../../components/layout/background/AuthBackground";
import { login } from "@services/AuthClient";
import { handleApiError } from "@services/ErrorHandler";
import { useAuth } from "../../components/context/auth/AuthFunction";
import type { User } from "@models/Auth";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [navigateToLandingPage, setNavigateToLandingPage] =
    useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const user: User = {
      id: null,
      email,
      password,
      firstName: null,
      lastName: null,
      photo: null,
    };

    try {
      await login(user);
      handleLogin();

      showSnackbar("User logged in successfully", "success");
      setNavigateToLandingPage(true);
    } catch (error) {
      console.error(error);

      showSnackbar(handleApiError(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSnackbarClose = () => {
    handleSnackbarClose();

    if (navigateToLandingPage) {
      navigate("/");
    }
  };

  return (
    <Box className={styles.authenticationBackground}>
      <AuthBackground />
      <Box className={styles.authenticationFormContainer}>
        <Box className={styles.authenticationForm}>
          <IconButton
            size="small"
            edge="start"
            className={styles.authIconButton}
            onClick={() => navigate("/")}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              className={styles.authIcon}
            />
          </IconButton>
          <form onSubmit={handleSubmit}>
            <Typography variant="h3" gutterBottom>
              Login
            </Typography>
            <Box>
              <TextField
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={email}
                onChange={handleChangeEmail}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={password}
                onChange={handleChangePassword}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              fullWidth
              disabled={isLoading}
              className={styles.authLoginButton}
            >
              {isLoading ? <CircularProgress /> : "Login"}
            </Button>
          </form>
          <Link to="/register" className={styles.authRegisterLink}>
            Don't have an account? Register here
          </Link>
        </Box>
      </Box>

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleLoginSnackbarClose}
      />
    </Box>
  );
};

export default LoginPage;
