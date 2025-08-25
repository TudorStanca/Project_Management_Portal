import { DefaultUser, type User } from "@models/Auth";
import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  handleLogin: () => {},
  handleLogout: () => {},
  isLoading: true,
  loggedUser: DefaultUser,
  handleSetLoggedUser: (_: User) => {},
});

export default AuthContext;
