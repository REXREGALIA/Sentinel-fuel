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
    truckNumber: '',
    model: '',
    capacity: '',
    status: 'active'
  });
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const truckData = {
        ...formData,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "trucks"), truckData);
      await fetchTrucks();
      
      // Reset form
      setFormData({
        truckNumber: '',
        model: '',
        capacity: '',
        status: 'active'
      });
      
      toast.success('Truck added successfully');
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
    setIsLoading(true);
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
    setIsLoading(false);
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
                  truckNumber: '',
                  model: '',
                  capacity: '',
                  status: 'active'
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
                        truckNumber: '',
                        model: '',
                        capacity: '',
                        status: 'active'
                      });
                    }}
                  >
                    <X size={28} />
                  </button>
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
                      {isEditing ? "Edit Truck" : "Add New Truck"}
                    </h2>
                    <form onSubmit={handleSubmit} className="truck-form">
                      <input 
                        type="text" 
                        name="truckNumber" 
                        value={formData.truckNumber}
                        onChange={handleChange}
                        placeholder="Truck Number" 
                        required 
                      />
                      <input 
                        type="text" 
                        name="model" 
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="Model" 
                        required 
                      />
                      <input 
                        type="text" 
                        name="capacity" 
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="Capacity" 
                        required 
                      />
                      <button type="submit">Add Truck</button>
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
              <div className="trucks-grid">
                {trucks.map(truck => (
                  <div key={truck.id} className="truck-card">
                    <h3>Truck #{truck.truckNumber}</h3>
                    <p>Model: {truck.model}</p>
                    <p>Capacity: {truck.capacity}</p>
                    <p>Status: {truck.status}</p>
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