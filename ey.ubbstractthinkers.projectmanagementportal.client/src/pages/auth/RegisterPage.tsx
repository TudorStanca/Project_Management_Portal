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
import { handleApiError } from "@services/ErrorHandler";
import { register } from "@services/AuthClient";
import AuthBackground from "../../components/layout/background/AuthBackground";
import type { User } from "@models/Auth";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [navigateToLogin, setNavigateToLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  const navigate = useNavigate();

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const user: User = {
      id: null,
      email,
      password,
      firstName,
      lastName,
      photo: null,
    };

    try {
      await register(user);

      showSnackbar("User registered successfully", "success");
      setNavigateToLogin(true);
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSnackbarClose = () => {
    handleSnackbarClose();

    if (navigateToLogin) {
      navigate("/login");
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
          <Typography variant="h3" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
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
              <TextField
                label="First Name"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={firstName}
                onChange={handleChangeFirstName}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={lastName}
                onChange={handleChangeLastName}
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
              {isLoading ? <CircularProgress /> : "Register"}
            </Button>
          </form>
          <Link to="/login" className={styles.authRegisterLink}>
            Already have an account? Login here
          </Link>
        </Box>
      </Box>

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleRegisterSnackbarClose}
      />
    </Box>
  );
};

export default RegisterPage;
