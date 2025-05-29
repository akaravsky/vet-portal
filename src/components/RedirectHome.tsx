import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RedirectHome = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Navigate to="/pets" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RedirectHome;
