import React from "react";
import { useState, useEffect } from "react";
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
    <>
      <form
        onSubmit={handleSubmit}
        className=" w-full h-full bg-white/30 backdrop-blur-md rounded-xl shadow-lg font-semibold text-xl flex justify-center items-start flex-col gap-4 p-5"
      >
        <label htmlFor="name">Enter Petrol Station name</label>
        <input
          type="text"
          id="name"
          onChange={(e) => setName(e.target.value)}
          className="w-1/2 border-b-2 border-b-pink-300 outline-none bg-transparent"
          value={name}
          required
        />

        <label htmlFor="address">Enter Petrol Sation Address</label>
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          className="w-1/2 border-b-2 border-b-pink-300 outline-none bg-transparent"
          id="address"
          value={address}
          required
        />

        <label htmlFor="img">Upload image</label>
        <input
          type="file"
          className=" border rounded w-1/2 py-2 px-3"
          onChange={handleImageChange}
          id="img"
          accept="image/*"
          required
        />

        {image &&
          (typeof image === "string" ? (
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          ) : (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          ))}

        <button
          type="submit"
          className="bg-green-300 px-4 py-2 rounded-md hover:bg-green-600 hover:text-white"
        >
          {cardData ? "Save Changes" : "Add Card"}
        </button>
      </form>
    </>
  );
};

export default Forms;