import React from 'react'
import { motion } from 'framer-motion'
import { CiMenuKebab } from "react-icons/ci"
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi"

const Card = ({ cardIndex, id, iamge, add, onDelete, onEdit, onClick, isExpanded }) => {
  const handleClick = (e) => {
    e.stopPropagation()
    onClick(cardIndex)
  }

  const cardContent = (
    <>
      <div className="relative">
        <img src={iamge} alt={id} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-2 left-2 text-white font-bold text-xl">{id}</h3>
      </div>
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-2">{add}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-400">Amount Due: $1000</span>
          <span className="text-sm font-semibold text-gray-400">Petrol: 500L</span>
        </div>
      </div>
    </>
  )

  if (isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl w-full max-w-2xl">
          {cardContent}
          <div className="p-4 border-t border-gray-700">
            <h4 className="text-lg font-semibold mb-2">Additional Details</h4>
            <p className="text-gray-300 mb-2">Last Refill: 2023-06-15</p>
            <p className="text-gray-300 mb-2">Manager: John Doe</p>
            <p className="text-gray-300">Contact: +1 234 567 8900</p>
          </div>
          <div className="flex justify-end p-4">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(cardIndex); }}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FiEdit2 className="inline mr-1" /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(cardIndex); }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FiTrash2 className="inline mr-1" /> Delete
            </button>
          </div>
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={handleClick}
          >
            <FiX size={24} />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      {cardContent}
    </motion.div>
  )
}

export default Card