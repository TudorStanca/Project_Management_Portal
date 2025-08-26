import { useEffect, useState, type ReactNode } from "react";
import AuthContext from "./AuthContext";
import { getUser } from "@services/AuthClient";
import { DefaultUser, type User } from "@models/Auth";
import useSnackbar from "../../../hooks/useSnackbar";
import CustomSnackbar from "../../../components/snackbar/CustomSnackbar";
import { handleApiError } from "@services/ErrorHandler";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = (props: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loggedUser, setLoggedUser] = useState<User>(DefaultUser);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  useEffect(() => {
    const fetchIsUserLogged = async () => {
      try {
        const loggedIn = await getUser();
        setIsAuthenticated(loggedIn != null);
        setLoggedUser(loggedIn || DefaultUser);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIsUserLogged();
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);
  const handleSetLoggedUser = (user: User) => setLoggedUser(user);

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          handleLogin,
          handleLogout,
          isLoading,
          loggedUser,
          handleSetLoggedUser,
        }}
      >
        {props.children}
      </AuthContext.Provider>
      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </>
  );
};

export default AuthProvider;
