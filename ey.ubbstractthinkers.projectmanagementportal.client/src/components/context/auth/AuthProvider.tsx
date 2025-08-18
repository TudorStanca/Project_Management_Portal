import { useEffect, useState, type ReactNode } from "react";
import AuthContext from "./AuthContext";
import { getUser } from "@services/AuthClient";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = (props: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIsUserLogged = async () => {
      try {
        const loggedIn = await getUser();
        setIsAuthenticated(loggedIn != null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIsUserLogged();
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, handleLogin, handleLogout, isLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
