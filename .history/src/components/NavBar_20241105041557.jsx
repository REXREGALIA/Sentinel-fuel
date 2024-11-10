import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, User, Truck, Settings, LogOut, Fuel, Menu, MapPin } from "lucide-react";
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { toast } from 'sonner';
import { useState } from 'react';

function NavLink({ icon, text, to = "#", onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 p-2 rounded-lg transition duration-300 ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

export default function Navbar({ sidebarOpen, toggleSidebar, handleLogout }) {
  const navItems = [
    { icon: <User size={20} />, text: "Drivers", to: "/drivers" },
    { icon: <Fuel size={20} />, text: "Petrol Pumps", to: "/home" },
    { icon: <Truck size={20} />, text: "Trucks", to: "/trucks" },
    { icon: <MapPin size={20} />, text: "Live Tracking", to: "/tracking" },
    { icon: <Settings size={20} />, text: "Settings", to: "/settings" },
  ];

  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      localStorage.removeItem('userId');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      <motion.nav
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
          width: "16rem",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gray-800 p-6 flex flex-col z-50 lg:relative lg:translate-x-0 lg:w-64 shadow-xl ${
          sidebarOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-2">
            <Fuel size={24} className="text-blue-500" />
            <h1 className="text-xl font-bold text-white">Sentinel Fuel</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              icon={item.icon}
              text={item.text}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            />
          ))}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoggingOut ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </span>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
    </>
  );
}