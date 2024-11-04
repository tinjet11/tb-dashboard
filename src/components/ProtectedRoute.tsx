import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingPage />; // Show a loading indicator while checking auth status
  }

  if (!user) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
