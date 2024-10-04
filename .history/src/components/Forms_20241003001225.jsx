import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Firebase";
import { motion } from "framer-motion";
import { deleteObject } from "firebase/storage"; // For deleting images from storage
import { doc, deleteDoc } from "firebase/firestore"; // For deleting documents from Firestore
import { FiUpload } from "react-icons/fi";

const Forms = ({ onAddCard, cardData, onSaveEdit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (cardData) {
      setName(cardData.name || "");
      setAddress(cardData.address || "");
      setImage(cardData.image || null);
      setPreview(cardData.imageUrl || null);
    }
  }, [cardData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let imageUrl = null;
      if (image && image instanceof File) {
        const randomImageName = `${Date.now()}_${image.name}`;
        const imageRef = ref(storage, randomImageName);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      const newCard = {
        name,
        address,
        imageUrl: imageUrl || (cardData && cardData.imageUrl) || null,
      };
  
      if (cardData) {
        // If there's a new image, delete the old one
        if (image && cardData.imageUrl) {
          await deleteImageFromStorage(cardData.imageUrl);
        }
        onSaveEdit(newCard);
      } else {
        await addDoc(collection(db, "petrolStations"), newCard);
        onAddCard(newCard);
      }
  
      // Reset form fields
      setName("");
      setAddress("");
      setImage(null);
      setPreview(null);
  
      toast.success(`Petrol Station ${cardData ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error("Error saving petrol station: ", error);
      toast.error(`Error ${cardData ? 'updating' : 'adding'} petrol station`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const deleteImageFromStorage = async (imageUrl) => {
    const imageRef = ref(storage, imageUrl); // imageUrl should be the path in your storage
    try {
      await deleteObject(imageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Petrol Station Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300">
            Petrol Station Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500  focus:bg-gray-600 focus:ring-0 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300">
            Upload Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex justify-center text-sm ">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer bg-transparent p-1 rounded-md font-medium text-blue-500 hover:text-blue-600 "
                >
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <span>Upload a file</span>
                  <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
                {/* <p className="pl-1">or drag and drop</p> */}
              </div>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF 
              </p>
            </div>
          </div>
        </div>

        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="border p-2 text-center border-white object-cover rounded-md"
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cardData ? "Save Changes" : "Add Station"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Forms;