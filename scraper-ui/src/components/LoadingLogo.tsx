import React from "react";

const LoadingLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative">
        <img
          src="/icon.png"
          alt="Logo"
          className="w-24 h-24 object-contain animate-bounce opacity-100"
        />
      </div>
      <div className="mt-4 text-lg font-medium animate-pulse">Loading...</div>
    </div>
  );
};

export default LoadingLogo;
