import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuKebab } from "react-icons/ci";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const Card = ({ cardIndex, id, iamge, add, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (isExpanded && !event.target.closest('.expanded-card')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isExpanded]);

  useEffect(() => {
    if (iamge instanceof File) {
      const url = URL.createObjectURL(iamge);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(iamge);
    }
  }, [iamge]);

  const cardContent = (
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
          <span>Amount Due</span>
          <span className="block mt-1">$ --</span>
        </div>
        <div className="text-xs font-semibold text-gray-500 text-right">
          <span>Petrol Remaining</span>
          <span className="block mt-1">-- L</span>
        </div>
      </div>
    </div>
  );

  const expandedContent = (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold mb-4">{id}</h2>
      <p className="text-lg mb-4">{add}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold">Amount Due</h3>
          <p>$ --</p>
        </div>
        <div>
          <h3 className="font-semibold">Petrol Remaining</h3>
          <p>-- L</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Additional Details</h3>
        <p>Last Refill: </p>
        <p>Storage Capacity: </p>
        <p>Fuel Types:</p>
        <p>Operatig Hours: </p>
        <p>Manager: </p>
        <p>Contact:</p>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          className="w-1/4 h-1/4 object-cover justify-center rounded-lg mb-4"
          alt={id}
        />
      )}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <FiEdit2 className="inline mr-2" />
          Edit
        </button>
        <button
          onClick={() => onDelete(cardIndex)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
        >
          <FiTrash2 className="inline mr-2" />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative cursor-pointer"
        onClick={toggleExpand}
      >
        {cardContent}
        <div className="absolute top-1 right-0">
          <button
            // onMouseEnter={() => setShowTooltip(true)}
            // onMouseLeave={() => setShowTooltip(false)}
            onClick={handleClick}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            // aria-label="More options"
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={toggleExpand}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 expanded-card"
              onClick={(e) => e.stopPropagation()}
            >
              {expandedContent}
              <button
                onClick={toggleExpand}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;