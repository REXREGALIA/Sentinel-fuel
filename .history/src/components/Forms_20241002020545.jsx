import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Firebase"; // Adjust the path based on your folder structure

const Forms = ({ onAddCard, cardData, onSaveEdit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (cardData) {
      setName(cardData.name || "");
      setAddress(cardData.address || "");
      setImage(cardData.image || null);
    }
  }, [cardData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;
      if (image) {
        // Generate a random image name or use the uploaded file name
        const randomImageName = `${Date.now()}_${image.name}`;
        const imageRef = ref(storage, randomImageName);

        // Upload the image
        await uploadBytes(imageRef, image);

        // Get the download URL
        imageUrl = await getDownloadURL(imageRef);
        console.log("Image uploaded, download URL:", imageUrl);
      }

      // If editing, save changes to cardData
      if (cardData) {
        onSaveEdit({ name, address, imageUrl }); // Pass updated data to parent
      } else {
        // Adding a new card
        const newCard = {
          name,
          address,
          imageUrl, // Save the download URL
        };

        // Add to Firestore
        await addDoc(collection(db, "petrolStations"), newCard);

        // Pass the new card to the parent
        onAddCard(newCard);
        console.log("Petrol Station added successfully!");
      }

      // Reset form fields
      setName("");
      setAddress("");
      setImage(null);

      toast.success("Petrol Station saved successfully!");
    } catch (error) {
      console.error("Error adding petrol station: ", error);
      toast.error("Error adding petrol station");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Set the image file when selected
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white/10 backdrop-blur-lg rounded-xl shadow-lg font-semibold text-xl flex flex-col gap-4 p-5"
    >
      <h2 className="text-center text-2xl font-bold text-gray-800">
        {cardData ? "Edit Petrol Station" : "Add New Petrol Station"}
      </h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-gray-700">
          Enter Petrol Station Name
        </label>
        <input
          type="text"
          id="name"
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b-2 border-pink-300 outline-none bg-transparent p-2 rounded-md focus:ring focus:ring-pink-300"
          value={name}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-gray-700">
          Enter Petrol Station Address
        </label>
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border-b-2 border-pink-300 outline-none bg-transparent p-2 rounded-md focus:ring focus:ring-pink-300"
          id="address"
          value={address}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="img" className="text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          className="border rounded w-full py-2 px-3 bg-gray-200"
          onChange={handleImageChange}
          id="img"
          accept="image/*"
          required
        />
      </div>

      {image && (
        <img
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          alt="Preview"
          className="mt-2 w-32 h-32 object-cover rounded-md shadow-md"
        />
      )}

      <button
        type="submit"
        className="bg-green-300 hover:bg-green-600 hover:text-white transition duration-300 px-4 py-2 rounded-md font-semibold"
      >
        {cardData ? "Save Changes" : "Add Petrol Station"}
      </button>
    </form>
  );
};

export default Forms;
