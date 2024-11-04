import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();

  // Show loading indicator while loading auth status or preferences
  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/unauthorized" />;
  }

  // Redirect to forbidden if the user is authenticated but not an admin
  if (user && user.prefs?.role !== "Admin") {
    return <Navigate to="/forbidden" />;
  }

  // Render children if user is authenticated and an admin
  return <>{children}</>;
}
