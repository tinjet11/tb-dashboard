// src/components/Navbar.tsx
import { Button } from "./ui/button";
import { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close menu on navigation
  const closeMenu = () => setIsOpen(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogOut() {
    const result = await logout(); // Call logout as a function
    if (result) {
      navigate("/login"); // Redirect to the login page if logout is successful
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-semibold text-gray-900">
          TB Management System
        </a>
        {user && (
          <>
            {/*Navigation Links (Desktop) */}
            <nav className="hidden md:flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                Administration
              </a>
              <a href="/about" className="text-gray-700 hover:text-gray-900">
                Monitoring
              </a>
              <a href="/contact" className="text-gray-700 hover:text-gray-900">
                Patient
              </a>
              {user.prefs?.role == "Doctor" &&
              <a href="/register" className="text-gray-700 hover:text-gray-900">
                Register
              </a>
              }
            </nav>
            {/*User Profile and Login/Logout Button (Desktop)*/}
            <div className="flex items-center space-x-4">
              <DropdownMenu onOpenChange={(value) => setIsOpen(value)}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-white hover:text-white hover:bg-slate-700"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.name || "User"}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href="/profile" className="w-full text-left">
                      Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="w-full text-left">
                      Settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}{" "}
        {/* : (
          <a href="/login">
            <Button variant="default">Login</Button>
          </a>
        )}  */}
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 md:hidden focus:outline-none"
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <nav className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4 transition-all duration-300">
            <div className="flex flex-col items-center space-y-4">
              <a
                href="/"
                className="text-gray-700 hover:text-gray-900"
                onClick={closeMenu}
              >
                Administration
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-gray-900"
                onClick={closeMenu}
              >
                Monitoring
              </a>
              <a
                href="/contact"
                className="text-gray-700 hover:text-gray-900"
                onClick={closeMenu}
              >
                Patient
              </a>
              <a
                href="/register"
                className="text-gray-700 hover:text-gray-900"
                onClick={closeMenu}
              >
                Register
              </a>
              {user ? (
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <a href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
