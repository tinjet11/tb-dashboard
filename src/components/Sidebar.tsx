import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Users2,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogOut() {
    const result = await logout();
    if (result) navigate("/login");
  }

  const menuItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/" },
    {
      label: "Appointments",
      icon: <Calendar size={20} />,
      path: "/appointments",
    },
    { label: "Patients", icon: <User size={20} />, path: "/patients" },
    { label: "Staffs", icon: <Users2 size={20} />, path: "/staffs" },
  ];

  return (
    <div
      className={`h-screen bg-blue-900 text-white transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64" : "w-20"
      } relative`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        {isSidebarOpen && (
          <span className="text-lg font-semibold">TB Management System</span>
        )}
        <button
          className="p-2 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-all"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>

      {/* User Profile Section */}

      <div
        className={`relative flex items-center p-4 hover:bg-blue-800 cursor-pointer transition-all group ${
          isSidebarOpen ? "gap-3" : "justify-center"
        }`}
      >
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-black font-medium">
          {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
        </div>

        <Link to="/profile" className="w-full text-left">
          {isSidebarOpen && (
            <span className="font-medium">{user?.name || "User"}</span>
          )}
        </Link>
        <span className="absolute left-full ml-3 bg-gray-900 text-white px-2 py-1 text-sm rounded-md opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
          {"Profile"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1">
        {menuItems
        .filter((item) => !(item.label === "Staffs" && user?.prefs?.role !== "Admin") && user)
        .map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`group relative flex items-center p-3 transition-all rounded-md ${
              location.pathname === item.path
                ? "bg-blue-800"
                : "hover:bg-blue-700"
            } ${isSidebarOpen ? "gap-4" : "justify-center"}`}
          >
            {item.icon}
            {isSidebarOpen && <span>{item.label}</span>}

            <span className="absolute left-full ml-3 bg-gray-900 text-white px-2 py-1 text-sm rounded-md opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogOut}
        className={`absolute bottom-4 left-4 right-4 flex items-center p-3 transition-all bg-black text-white rounded-md ${
          isSidebarOpen ? "gap-4" : "justify-center"
        } hover:bg-gray-800`}
      >
        <LogOut />
        {isSidebarOpen && <span>Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
