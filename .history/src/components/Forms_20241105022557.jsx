import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../Firebase";
import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";

const Forms = ({ onAddCard, cardData, onSaveEdit }) => {
  const [formData, setFormData] = useState({
    name: cardData?.name || '',
    address: cardData?.address || '',
    capacity: cardData?.capacity || '',
    fuelTypes: cardData?.fuelTypes || '',
    operatingHours: cardData?.operatingHours || '',
    contactNumber: cardData?.contactNumber || '',
    managerName: cardData?.managerName || '',
    image: null,
    locationType: cardData?.locationType || '',
    latitude: cardData?.latitude || '',
    longitude: cardData?.longitude || '',
    zipCode: cardData?.zipCode || ''
  });

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl; // Keep existing image URL if editing

      if (formData.image) {
        const imageRef = ref(storage, `station-images/${formData.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const stationData = {
        ...formData,
        imageUrl: imageUrl
      };

      delete stationData.image; // Remove file object before storing

      if (cardData) {
        await onSaveEdit(stationData);
      } else {
        await onAddCard(stationData);
      }

      // Reset form if not editing
      if (!cardData) {
        setFormData({
          name: '',
          address: '',
          capacity: '',
          fuelTypes: '',
          operatingHours: '',
          contactNumber: '',
          managerName: '',
          image: null,
          locationType: '',
          latitude: '',
          longitude: '',
          zipCode: ''
        });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit form');
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
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
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
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
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
                  checked={formData.fuelTypes.includes(type)}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuelTypes: e.target.checked ? [...prev.fuelTypes, type] : prev.fuelTypes.filter(t => t !== type) }))}
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
            value={formData.operatingHours}
            onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
            placeholder="e.g., 24/7 or 6:00 AM - 10:00 PM"
            className="mt-1 block w-full p-1 rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-600 focus:ring-0 text-white"
          />
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
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
            value={formData.managerName}
            onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
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

        {formData.image && (
          <div className="mt-2 flex justify-center">
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="border p-2 flex justify-center border-white object-cover rounded-md"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Location Type</label>
            <select
              name="locationType"
              value={formData.locationType}
              onChange={(e) => setFormData(prev => ({ ...prev, locationType: e.target.value }))}
              className="w-full bg-gray-700 p-2 rounded"
              required
            >
              <option value="">Select Location Type</option>
              <option value="coordinates">Coordinates</option>
              <option value="zipcode">Zip Code</option>
            </select>
          </div>

          {formData.locationType === 'coordinates' ? (
            <>
              <div>
  <label className="block mb-1">Latitude</label>
  <input
    type="number"
    step="any" // Allows any decimal number
    name="latitude"
    value={formData.latitude}
    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
    className="w-full bg-gray-700 p-2 rounded"
    required
  />
</div>
<div>
  <label className="block mb-1">Longitude</label>
  <input
    type="number"
    step="any" // Allows any decimal number
    name="longitude"
    value={formData.longitude}
    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
    className="w-full bg-gray-700 p-2 rounded"
    required
  />
</div>
            </>
          ) : (
            <div>
              <label className="block mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                className="w-full bg-gray-700 p-2 rounded"
                required={formData.locationType === 'zipcode'}
              />
            </div>
          )}
        </div>

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