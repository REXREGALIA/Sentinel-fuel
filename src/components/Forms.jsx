import React from 'react'
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import Card from '../components/Card';

const Forms = () => {

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [submit, setSubmit] = useState(false);


  const handleSubmit = (e)=>{
    e.preventDefault();
    // console.log(name, address, image);
    <Card id={name} add={address}/>
  }

  return (
    <>
    <form 
    onSubmit={handleSubmit}
    className=' w-full h-full bg-white/30 backdrop-blur-md rounded-xl shadow-lg font-semibold text-xl flex justify-center items-start flex-col gap-4 p-5'>
    
      <label htmlFor="name">Enter Petrol Station name</label>
      <input type="text"
      id="name"
      onChange={(e) => setName(e.target.value)}
      className='w-1/2 border-b-2 border-b-pink-300 outline-none bg-transparent'
      value={name}/>

      <label htmlFor="address">Enter Petrol Sation Address</label>
      <input type="text" 
      onChange={(e) => setAddress(e.target.value)}
      className='w-1/2 border-b-2 border-b-pink-300 outline-none bg-transparent'
      id="address"
      value={address}/>

      <label htmlFor="img">Upload image</label>
      <input type="text"
      className='w-1/2 border-b-2 border-b-pink-300 outline-none bg-transparent'
      id="img"
      onChange={(e) => setImage(e.target.value)}
      value={image}
      />

      <Toaster/>

      <button type='submit'
      className='bg-green-300 px-4 py-2 rounded-md hover:bg-green-600 hover:text-white'
      onClick={() => toast("Form Submitted")}
      >Submit</button>

    </form>
    </>
  )
}

export default Forms