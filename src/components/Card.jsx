import React, { useRef, useState, useEffect } from 'react'
import { CiMenuKebab } from "react-icons/ci";

const Card = ({cardIndex, id, iamge, add, onDelete, onEdit}) => {

  const [showMenu, setShowMenu] = useState(false); // State to toggle menu

  const dropdownRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(null);

  // Toggle menu visibility
  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(cardIndex); // Call the onEdit function passed as a prop
  };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
      
      const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowMenu(false); // Close the dropdown
        }
      };
  
      document.addEventListener('mousedown', handleOutsideClick);
  
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick); // Clean up
      };

    }, []);

  useEffect(() => {
    if (iamge instanceof File) {
      const url = URL.createObjectURL(iamge);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url); // Clean up the URL when component unmounts or image changes
      };
    } else {
      setImageUrl(iamge); // Assume it's already a URL string
    }
  }, [iamge]);

  return (
    <>
<div className="max-w-sm rounded overflow-hidden shadow-lg bg-pink-100 p-4">

<div className='flex justify-between'>
  
  <div className="">
    <p className="font-bold text-xl mb-2">{id}</p>
    <p className="text-gray-700 text-base">
      {add}
    </p>
  </div>

  <div className='flex'>

  {imageUrl && (<img src={imageUrl} className=" rounded-full h-24 w-24" alt="Card Image" />)}

  <CiMenuKebab className='cursor-pointer' onClick={handleClick}/>

              {/* Dropdown menu */}
              {showMenu && (
              <div 
              ref={dropdownRef} // Attach ref to the dropdown
              className="absolute mt-4 w-24 ml-8 bg-white rounded-md shadow-lg">
                <button
                  onClick={handleEdit}
                  className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(cardIndex)}
                  className="block w-full px-4 py-2 text-center text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>

              </div>
            )}

  </div>

</div>

  <div className="mt-5">

    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      Amount Due
    </span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      Petrol Remaining
    </span>
    
  </div>

</div>
    </>
  )
}

export default Card