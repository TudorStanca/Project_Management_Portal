import { useAuth } from "./AuthFunction";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Solves the situation where the protected route is rendered before the function that verifies if a user is authenticated finishes
  if (isLoading) {
    return null;
  }

  return isAuthenticated ? props.children : <Navigate to="/login" />;
};

export default ProtectedRoute;
