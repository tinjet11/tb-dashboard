import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/administration";
import NotFound from "./pages/errorPage/NotFound";
import { StaffRegisterForm } from "./pages/staffRegistration";
import { StaffLoginForm } from "./pages/login/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/profile/ProfilePage";

import { Toaster } from "react-hot-toast";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PasswordRecovery from "./pages/passwordRecovery/PasswordRecoveryForm";
import Unauthorized from "./pages/errorPage/Unauthorized";
import Navbar from "./components/Navbar";
import Forbidden from "./pages/errorPage/Forbidden";

function App() {
  return (
    <>
      <Toaster />
    <Navbar /> 
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
          //   <AdminProtectedRoute>
            <StaffRegisterForm />
            //</AdminProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<StaffLoginForm />} />
        <Route path="/recover-password" element={<PasswordRecovery />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forbidden" element={<Forbidden/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
