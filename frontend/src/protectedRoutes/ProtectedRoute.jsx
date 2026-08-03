import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element, allowedRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>A carregar...</p>; // ou um spinner, mais tarde
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
