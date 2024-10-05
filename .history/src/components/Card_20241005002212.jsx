import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuKebab } from "react-icons/ci";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Card = ({ 
  cardIndex, 
  id, 
  iamge, 
  add, 
  capacity,
  fuelTypes,
  operatingHours,
  contactNumber,
  managerName,
  onDelete, 
  onEdit 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(cardIndex);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (iamge instanceof File) {
      const url = URL.createObjectURL(iamge);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(iamge);
    }
  }, [iamge]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4 min-w-0">
          <div className="flex-grow mr-4 min-w-0">
            <h3 className="text-white font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis mb-1 max-w-full">{id}</h3>
            <p className="text-white text-sm md:text-lg font-semibold overflow-hidden whitespace-normal break-words max-w-full">{add}</p>
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              className="w-20 h-20 object-cover rounded-full flex-shrink-0"
              alt={id}
            />
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-semibold text-gray-500">
            <span>Capacity</span>
            <span className="block mt-1">{capacity} L</span>
          </div>
          <div className="text-xs font-semibold text-gray-500 text-right">
            <span>Operating Hours</span>
            <span className="block mt-1">{operatingHours}</span>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-500 mb-2">
          <span>Fuel Types</span>
          <span className="block mt-1">{fuelTypes.join(", ")}</span>
        </div>

        <div className="text-xs font-semibold text-gray-500 mb-2">
          <span>Contact</span>
          <span className="block mt-1">{contactNumber}</span>
        </div>

        <div className="text-xs font-semibold text-gray-500">
          <span>Manager</span>
          <span className="block mt-1">{managerName}</span>
        </div>
      </div>

      <div className="absolute top-1 right-0">
        <button
          onClick={handleClick}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <CiMenuKebab className="text-gray-400" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-3 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10"
            >
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:border hover:border-white transition-colors duration-200"
              >
                <FiEdit2 className="mr-2" />
                Edit
              </button>
              <hr className="border-gray-600" />
              <button
                onClick={() => onDelete(cardIndex)}
                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:border hover:border-white transition-colors duration-200"
              >
                <FiTrash2 className="mr-2" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Card;