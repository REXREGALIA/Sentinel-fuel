import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CiMenuKebab } from "react-icons/ci"
import { FiEdit2, FiTrash2 } from "react-icons/fi"

const Card = ({ cardIndex, id, iamge, add, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false)
  const dropdownRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(null)

  const handleClick = () => setShowMenu(!showMenu)

  const handleEdit = () => {
    setShowMenu(false)
    onEdit(cardIndex)
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    if (iamge instanceof File) {
      const url = URL.createObjectURL(iamge)
      setImageUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setImageUrl(iamge)
    }
  }, [iamge])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative">
        {imageUrl && (
          <img 
            src={imageUrl} 
            className="w-full h-48 object-cover" 
            alt={id} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white font-bold text-xl truncate">{id}</h3>
          <p className="text-gray-300 text-sm truncate">{add}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-400">Amount Due</span>
          <span className="text-sm font-semibold text-gray-400">Petrol Remaining</span>
        </div>

        <div className="relative">
          <button
            onClick={handleClick}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            aria-label="More options"
          >
            <CiMenuKebab className="text-gray-400" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10"
              >
                <button
                  onClick={handleEdit}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                >
                  <FiEdit2 className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(cardIndex)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-600 transition-colors duration-200"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default Card