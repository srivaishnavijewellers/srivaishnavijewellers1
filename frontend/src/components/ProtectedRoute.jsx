import { Navigate, useLocation } from "react-router-dom";
import { getStoredSession, isSessionExpired } from "../utils/authStorage.js";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const session = getStoredSession();

  if (!session || isSessionExpired(session)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;

