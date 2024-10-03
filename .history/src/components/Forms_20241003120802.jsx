import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../Firebase";
import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";

const Forms = ({ onAddCard, cardData, onSaveEdit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [capacity, setCapacity] = useState("");
  const [fuelTypes, setFuelTypes] = useState([]);
  const [operatingHours, setOperatingHours] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    if (cardData) {
      setName(cardData.name || "");
      setAddress(cardData.address || "");
      setImage(cardData.image || null);
      setPreview(cardData.imageUrl || null);
      setCapacity(cardData.capacity || "");
      setFuelTypes(cardData.fuelTypes || []);
      setOperatingHours(cardData.operatingHours || "");
      setContactNumber(cardData.contactNumber || "");
      setManagerName(cardData.managerName || "");
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
        capacity,
        fuelTypes,
        operatingHours,
        contactNumber,
        managerName,
      };

      if (cardData) {
        if (image && cardData.imageUrl) {
          await deleteImageFromStorage(cardData.imageUrl);
        }
        onSaveEdit(newCard);
      } else {
        await addDoc(collection(db, "petrolStations"), newCard);
        onAddCard(newCard);
      }

      // resetForm();
      toast.success(`Petrol Station ${cardData ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error("Error saving petrol station: ", error);
      toast.error(`Error ${cardData ? 'updating' : 'adding'} petrol station`);
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setImage(null);
    setPreview(null);
    setCapacity("");
    setFuelTypes([]);
    setOperatingHours("");
    setContactNumber("");
    setManagerName("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const deleteImageFromStorage = async (imageUrl) => {
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  const handleFuelTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFuelTypes([...fuelTypes, value]);
    } else {
      setFuelTypes(fuelTypes.filter(type => type !== value));
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
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">
            Storage Capacity (in Liters)
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white "
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fuel Types Available
          </label>
          <div className="space-y-2">
            {['Petrol', 'Diesel'].map((type) => (
              <label key={type} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value={type}
                  checked={fuelTypes.includes(type)}
                  onChange={handleFuelTypeChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-300">
            Operating Hours
          </label>
          <input
            type="text"
            id="operatingHours"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            placeholder="e.g., 24/7 or 6:00 AM - 10:00 PM"
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
          />
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
          />
        </div>

        <div>
          <label htmlFor="managerName" className="block text-sm font-medium text-gray-300">
            Manager Name
          </label>
          <input
            type="text"
            id="managerName"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300">
            Upload Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex justify-center text-sm">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer bg-transparent p-1 rounded-md font-medium text-blue-500 hover:text-blue-600"
                >
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <span>Upload a file</span>
                  <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF 
              </p>
            </div>
          </div>
        </div>

        {preview && (
          <div className="mt-2 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="border p-2 flex justify-center border-white object-cover rounded-md"
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