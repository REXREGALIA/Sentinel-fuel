import React from 'react'

const Card = ({id,add}) => {
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

  <img
    className=" rounded-full h-24 w-24"
    src="https://cdn4.singleinterface.com/files/banner_images/96681/8976_1607349099_16590190.jpg"
    alt="petrol_station image"
  />

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