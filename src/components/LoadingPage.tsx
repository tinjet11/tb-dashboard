import React from "react";

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-gray-500">{message ?? "Please wait while we fetch the data."}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
