import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  handleLogin: () => {},
  handleLogout: () => {},
  isLoading: true,
});

export default AuthContext;
