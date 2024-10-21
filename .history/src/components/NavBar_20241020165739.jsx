import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, User, Truck, Settings, LogOut } from "lucide-react";

function NavLink({ icon, text, to = "#" }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-300"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

export default function Navbar({ sidebarOpen, toggleSidebar, handleLogout }) {
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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gray-800 p-6 flex flex-col z-50 lg:relative lg:translate-x-0 lg:w-64 lg:flex ${
          sidebarOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex items-center justify-center md:justify-between my-16">
          <div className="flex items-center justify-center md:w-auto md:flex-1">
            <h1 className="text-xl font-bold text-center md:text-left">
              Sentinel Fuel
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-4 flex items-start lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-8 text-xl">
          <NavLink icon={<User size={20} />} text="Add Driver" to="/drivers" />
          <NavLink icon={<Truck size={20} />} text="Add Petrol Pump" to="/home" />
          <NavLink icon={<Truck size={20} />} text="Add Petrol Pump" to="/home" />
          <NavLink icon={<Settings size={20} />} text="Settings" to="/settings" />
          <button
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition gap-2 duration-300"
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </motion.nav>
    </>
  );
}