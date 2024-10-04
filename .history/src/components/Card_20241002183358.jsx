import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuKebab } from "react-icons/ci";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Card = ({ cardIndex, id, iamge, add, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
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
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow mr-4">
          <h3 className="text-white font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis mb-1  max-w-xs">{id}</h3>
          <p className=" text-white text-sm md:text-lg font-semibold overflow-hidden whitespace-normal break-words max-w-xs">{add}</p>
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              alt={id}
            />
          )}

        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={handleClick}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            aria-label="More options"
          >
            <CiMenuKebab className="text-gray-400" />
          </button>

          {/* Tooltip */}
          {/* {showTooltip && (
            <div className="absolute top-6 right-0 mb-10 mr-2 w-32 bg-gray-700 text-white text-sm rounded-md p-2 z-20">
              More options
            </div>
          )} */}

          <AnimatePresence>
            {showMenu && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.1 }}
                className="absolute right- top-2 mb-2 w-32 bg-gray-700 rounded-md shadow-lg z-10"
              >
                <button
                  onClick={handleEdit}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:border hover:border-white transition-colors duration-200"
                >
                  <FiEdit2 className="mr-2" />
                  Edit
                </button>
                <hr />
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
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-semibold text-gray-500">
            <span>Amount Due</span>
            <span className="block mt-1">$0.00</span>
          </div>
          <div className="text-xs font-semibold text-gray-500 text-right">
            <span>Petrol Remaining</span>
            <span className="block mt-1">0 L</span>
          </div>
        </div>

        
      </div>
    </motion.div>
  );
};

export default Card;