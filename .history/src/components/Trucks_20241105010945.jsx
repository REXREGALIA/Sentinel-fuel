import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  X,
  Upload,
  Menu,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Navbar from "./NavBar";
import { db, storage } from "../Firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Toaster, toast } from "sonner";
import { auth } from "../Firebase";

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    truckId: '',
    model: '',
    capacity: '',
    image: null,
    locationType: '',
    latitude: '',
    longitude: '',
    zipCode: '',
    address: '',
    status: 'active'
  });
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Query trucks with userId filter
      const trucksRef = collection(db, "trucks");
      const q = query(trucksRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const trucksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTrucks(trucksList);
    } catch (error) {
      console.error("Error fetching trucks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && !event.target.closest(".menu-container")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      let imageUrl = '';
      if (formData.image) {
        const imageRef = ref(storage, `truck-images/${formData.truckId}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const truckData = {
        ...formData,
        imageUrl: imageUrl,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      delete truckData.image; // Remove the file object before storing

      await addDoc(collection(db, "trucks"), truckData);
      toast.success('Truck added successfully');
      
      // Reset form
      setFormData({
        truckId: '',
        model: '',
        capacity: '',
        image: null,
        locationType: '',
        latitude: '',
        longitude: '',
        zipCode: '',
        address: '',
        status: 'active'
      });
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to add truck');
    }
  };

  const checkTruckExists = async (truckId) => {
    const trucksRef = collection(db, "trucks");
    const q = query(trucksRef, where("truckId", "==", truckId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleTruckClick = (truck) => {
    setSelectedTruck(truck);
  };

  const handleEditClick = (truck) => {
    console.log("Editing truck:", truck);
    setFormData({
      truckId: truck.truckId,
      model: truck.model,
      capacity: truck.capacity,
      licensePlate: truck.licensePlate,
      image: truck.image || null,
    });
    setSelectedTruck(truck);
    setIsEditing(true);
    setShowForm(true);
    setOpenMenu(null);
  };

  const handleDeleteClick = async (truck) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "trucks", truck.id));
      if (truck.image) {
        const imageRef = ref(storage, `truck-images/${truck.truckId}`);
        await deleteObject(imageRef).catch((error) => {
          console.error("Error deleting image:", error);
        });
      }
      await fetchTrucks();
      toast.success("Truck deleted successfully!");
    } catch (error) {
      console.error("Error deleting truck: ", error);
      toast.error(
        "An error occurred while deleting the truck. Please try again."
      );
    }
    setLoading(false);
    setOpenMenu(null);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Toaster position="bottom-right" />
      <Navbar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 p-4 flex justify-between items-center lg:hidden">
          <button onClick={toggleSidebar} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="min-h-screen bg-gray-900 p-8">
            <h1 className="text-5xl font-bold mb-10 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Truck Fleet Management
              </span>
            </h1>

            <button
              className="mb-8 px-6 py-3 bg-blue-600 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  truckId: "",
                  model: "",
                  capacity: "",
                  licensePlate: "",
                  image: null,
                });
                setShowForm(true);
              }}
            >
              <span className="text-lg">Add New Truck</span>
              <PlusCircle size={24} />
            </button>

            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                      setFormData({
                        truckId: "",
                        model: "",
                        capacity: "",
                        licensePlate: "",
                        image: null,
                      });
                    }}
                  >
                    <X size={28} />
                  </button>
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
                      {isEditing ? "Edit Truck" : "Add New Truck"}
                    </h2>
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="truckId"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Truck ID
                          </label>
                          <input
                            type="text"
                            id="truckId"
                            name="truckId"
                            value={formData.truckId}
                            onChange={handleChange}
                            placeholder="e.g., TRK-001"
                            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 border border-gray-600"
                            required
                            disabled={isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="model"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Model
                          </label>
                          <input
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="e.g., Volvo FH16"
                            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 border border-gray-600"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="capacity"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Capacity (Liters)
                          </label>
                          <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            placeholder="e.g., 40000"
                            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 border border-gray-600"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="licensePlate"
                            className="block text-sm font-medium text-gray-300"
                          >
                            License Plate
                          </label>
                          <input
                            type="text"
                            id="licensePlate"
                            name="licensePlate"
                            value={formData.licensePlate}
                            onChange={handleChange}
                            placeholder="e.g., ABC 1234"
                            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 border border-gray-600"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium text-gray-300 cursor-pointer"
                        >
                          Truck Image
                        </label>
                        <div className="flex items-center justify-start">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="image"
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 text-sm shadow-md"
                          >
                            <Upload size={18} className="mr-2" />
                            Choose File
                          </label>
                          {formData.image && (
                            <>
                              <img
                                src={formData.image}
                                alt="Preview"
                                className="w-16 h-16 mx-5 object-cover rounded-lg border-2 border-blue-400"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                Clear Image
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full bg-gray-700 p-2 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Location Type</label>
                        <select
                          name="locationType"
                          value={formData.locationType}
                          onChange={handleChange}
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
                              step="any"
                              name="latitude"
                              value={formData.latitude}
                              onChange={handleChange}
                              className="w-full bg-gray-700 p-2 rounded"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Longitude</label>
                            <input
                              type="number"
                              step="any"
                              name="longitude"
                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? isEditing
                            ? "Updating..."
                            : "Adding..."
                          : isEditing
                          ? "Update Truck"
                          : "Add Truck"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center">
                <p className="text-xl">Loading trucks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex flex-col items-center bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 relative"
                  >
                    <div
                      className="w-full h-full cursor-pointer"
                      onClick={() => handleTruckClick(truck)}
                    >
                      <div className="truck-image-container relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                        <img
                          src={truck.image || "https://via.placeholder.com/150?text=No+Image"}
                          alt={truck.truckId}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>
                      <p className="text-center text-lg font-semibold text-blue-400">
                        {truck.truckId}
                      </p>
                      <p className="text-sm text-gray-400">{truck.model}</p>
                    </div>
                    <div className="absolute top-2 right-2 menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === truck.id ? null : truck.id);
                        }}
                        className="p-2 rounded-full hover:bg-gray-600 transition duration-300"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === truck.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(truck);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(truck);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTruck && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full relative shadow-2xl">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                    onClick={() => setSelectedTruck(null)}
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-3xl font-bold mb-4 text-blue-400">
                    {selectedTruck.truckId}
                  </h2>
                  <img
                    src={selectedTruck.image}
                    alt={selectedTruck.truckId}
                    className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
                    onError={(e) => {
                      console.error(
                        `Error loading image for truck ${selectedTruck.truckId}:`,
                        e
                      );
                      e.target.src =
                        "https://via.placeholder.com/150?text=Truck"; // Fallback image
                    }}
                  />
                  <div className="space-y-3 text-lg">
                    <p>
                      <span className="font-semibold text-gray-400">
                        Model:
                      </span>{" "}
                      {selectedTruck.model}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Capacity:
                      </span>{" "}
                      {selectedTruck.capacity} Liters
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        License Plate:
                      </span>{" "}
                      {selectedTruck.licensePlate}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}