// src/components/Navbar.tsx
import { Button } from "./ui/button";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container w-max px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-semibold text-gray-900">
          Brand
        </a>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-4">
          <a href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </a>
          <a href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </a>
          <a href="/services" className="text-gray-700 hover:text-gray-900">
            Services
          </a>
          <a href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </a>
        </nav>

        {/* Button */}
        <Button variant="default" className="hidden md:block">
          Get Started
        </Button>

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
          <nav className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4">
            <div className="flex flex-col items-center space-y-4">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="/about" className="text-gray-700 hover:text-gray-900">
                About
              </a>
              <a href="/services" className="text-gray-700 hover:text-gray-900">
                Services
              </a>
              <a href="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </a>
              <Button variant="default" className="w-full">
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
