import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role?: "admin" | "member";
}) => {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;

  if (role && auth.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};
