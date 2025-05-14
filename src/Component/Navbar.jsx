import { Search, Bell, Menu, User } from "lucide-react";
import { useState } from "react";

const ProfessionalNavbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-900 w-full">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-[#118efc]  rounded-lg p-1 mr-2">
                  <img src="/logo1.png" className="h-8 w-8" alt="Logo" />
                </div>
                <span className="font-bold text-xl text-white  sm:block">
                  Simple Note
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, visible on medium screens and up */}
          <div
            className={`relative w-full max-w-md mx-4 transition-all duration-300 hidden sm:block ${
              isSearchFocused ? "scale-105" : ""
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full bg-gray-800 border border-transparent focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Right Menu Items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-700 focus:outline-none hidden sm:block">
              <Bell size={20} />
            </button>
            <div className="hidden md:block">
              <button className="flex items-center bg-gray-800 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-1">
                <span className="sr-only">Open user menu</span>
                <User
                  size={24}
                  className="rounded-full bg-gray-700 p-1 text-gray-300"
                />
              </button>
            </div>
            <button
              className="md:hidden text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu - Shows when menu button is clicked */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-3 space-y-1">
            <div className="px-2 py-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full bg-gray-800 border border-transparent focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none"
                />
              </div>
            </div>
            <div className="px-2 py-2 flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">
              <span>Notifications</span>
              <Bell size={20} />
            </div>
            <div className="px-2 py-2 flex items-center text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">
              <User
                size={24}
                className="rounded-full bg-gray-700 p-1 text-gray-300 mr-2"
              />
              <span>Profile</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalNavbar;
