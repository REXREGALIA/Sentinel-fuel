import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Upload, Truck, Phone, FileText, Menu, Edit, Trash2, MoreVertical } from 'lucide-react';
import Navbar from './NavBar';
import { db, storage, auth } from '../Firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Toaster, toast } from 'sonner';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    driverId: '',
    truckId: '',
    licenseNumber: '',
    image: null,
    contactNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [error, setError] = useState(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Query drivers with userId filter
      const driversRef = collection(db, "drivers");
      const q = query(driversRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const driversList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setDrivers(driversList);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
      const querySnapshot = await getDocs(collection(db, 'drivers'));
      if (querySnapshot.empty) {
        console.log('No drivers found');
        setDrivers([]);
      } else {
        const driversData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDrivers(driversData);
      }
    } catch (error) {
      console.error('Error fetching drivers: ', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
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
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting handleSubmit");

    try {
      if (!isEditing) {
        const driverExists = await checkDriverExists(formData.driverId);
        if (driverExists) {
          toast.error('A driver with this Driver ID already exists!');
          setIsLoading(false);
          return;
        }
      }

      console.log("Form data:", formData);
      let imageUrl = formData.image;
      let driverData = {
        name: formData.name,
        driverId: formData.driverId,
        truckId: formData.truckId,
        licenseNumber: formData.licenseNumber,
        contactNumber: formData.contactNumber,
      };

      console.log("Initial imageUrl:", imageUrl);

      // Handle image upload
      if (formData.image && formData.image.startsWith("data:")) {
        console.log("Uploading new image");
        const response = await fetch(formData.image);
        const blob = await response.blob();
        const imageRef = ref(storage, `driver-images/${formData.driverId}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
        console.log("New image uploaded, URL:", imageUrl);
        driverData.image = imageUrl;
      } else if (!formData.image && isEditing && selectedDriver.image) {
        console.log("Deleting old image");
        const imageRef = ref(storage, `driver-images/${selectedDriver.driverId}`);
        await deleteObject(imageRef).catch((error) => {
          console.error("Error deleting old image:", error);
        });
        driverData.image = null;
        console.log("Old image deleted");
      } else if (isEditing && formData.image) {
        console.log("Using existing image URL");
        driverData.image = formData.image;
      }

      console.log("Final driverData:", driverData);

      if (isEditing) {
        console.log("Updating existing driver");
        await updateDoc(doc(db, "drivers", selectedDriver.id), driverData);
        console.log("Driver updated successfully");
        toast.success("Driver updated successfully!");
      } else {
        console.log("Adding new driver");
        await addDoc(collection(db, "drivers"), driverData);
        console.log("Driver added successfully");
        toast.success("Driver added successfully!");
      }

      setShowForm(false);
      setFormData({
        name: '',
        driverId: '',
        truckId: '',
        licenseNumber: '',
        image: null,
        contactNumber: '',
      });
      setIsEditing(false);
      setSelectedDriver(null);
      await fetchDrivers();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(
        "An error occurred while adding/updating the driver. Please try again."
      );
    }
    setIsLoading(false);
    console.log("handleSubmit completed");
  };

  const checkDriverExists = async (driverId) => {
    const driversRef = collection(db, 'drivers');
    const q = query(driversRef, where('driverId', '==', driverId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
  };

  const handleEditClick = (driver) => {
    console.log("Editing driver:", driver);
    setFormData({
      name: driver.name,
      driverId: driver.driverId,
      truckId: driver.truckId,
      licenseNumber: driver.licenseNumber,
      image: driver.image || null,
      contactNumber: driver.contactNumber,
    });
    setSelectedDriver(driver);
    setIsEditing(true);
    setShowForm(true);
    setOpenMenu(null);
  };

  const handleDeleteClick = async (driver) => {
    if (true) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, "drivers", driver.id));
        if (driver.image) {
          const imageRef = ref(storage, `driver-images/${driver.driverId}`);
          await deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
          });
        }
        await fetchDrivers();
        toast.success("Driver deleted successfully!");
      } catch (error) {
        console.error("Error deleting driver: ", error);
        toast.error(
          "An error occurred while deleting the driver. Please try again."
        );
      }
      setIsLoading(false);
      setOpenMenu(null);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex">
      <Toaster position="bottom-right" />
      <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 flex justify-between items-center lg:hidden">
          <button onClick={toggleSidebar} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <h1 className="text-5xl font-extrabold mb-10 text-center text-blue-400">
            Driver Fleet
          </h1>

          <button
            className="mb-8 px-6 py-3 bg-blue-600 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300 shadow-lg"
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: '',
                driverId: '',
                truckId: '',
                licenseNumber: '',
                image: null,
                contactNumber: '',
              });
              setShowForm(true);
            }}
          >
            <span className="font-semibold">Add New Driver</span>
            <PlusCircle />
          </button>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 text-gray-100 rounded-2xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setFormData({
                      name: '',
                      driverId: '',
                      truckId: '',
                      licenseNumber: '',
                      image: null,
                      contactNumber: '',
                    });
                  }}
                >
                  <X size={24} />
                </button>
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
                    {isEditing ? "Edit Driver" : "Add New Driver"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., John Doe"
                          className="w-full p-3 bg-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="driverId" className="block text-sm font-medium text-gray-300">Driver ID</label>
                        <input
                          type="text"
                          id="driverId"
                          name="driverId"
                          value={formData.driverId}
                          onChange={handleChange}
                          placeholder="e.g., DRV-001"
                          className="w-full p-3 bg-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                          required
                          disabled={isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="truckId" className="block text-sm font-medium text-gray-300">Truck ID</label>
                        <input
                          type="text"
                          id="truckId"
                          name="truckId"
                          value={formData.truckId}
                          onChange={handleChange}
                          placeholder="e.g., TRK-001"
                          className="w-full p-3 bg-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-300">License Number</label>
                        <input
                          type="text"
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          placeholder="e.g., DL12345678"
                          className="w-full p-3 bg-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-300 cursor-pointer">Driver Image</label>
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
                          className="flex items-center px-4 py-2 bg-blue-600 text-gray-100 rounded-md cursor-pointer hover:bg-blue-700 transition duration-200 text-sm"
                        >
                          <Upload size={18} className="mr-2" />
                          Choose File
                        </label>
                        {formData.image && (
                          <>
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-12 h-12 mx-5 object-cover rounded-full border-2 border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              Clear Image
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">Contact Number</label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="e.g., +91 1234567890"
                        className="w-full p-3 bg-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-gray-100 rounded-md hover:bg-blue-700 transition duration-300 font-medium text-lg shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? isEditing
                          ? "Updating..."
                          : "Adding..."
                        : isEditing
                        ? "Update Driver"
                        : "Add Driver"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center">
              <p className="text-xl">Loading drivers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {drivers.map((driver) => (
                <div key={driver.id} className="flex flex-col items-center bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition duration-300 relative">
                  <div className="relative w-32 h-32 mb-4">
                    <img 
                      src={driver.image} 
                      alt={driver.name} 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        console.error(`Error loading image for driver ${driver.name}:`, e);
                        e.target.src = 'https://via.placeholder.com/150'; // Provide a fallback image
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{driver.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{driver.driverId}</p>
                  <button
                    onClick={() => handleDriverClick(driver)}
                    className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300"
                  >
                    View Details
                  </button>
                  <div className="absolute top-2 right-2 menu-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === driver.id ? null : driver.id);
                      }}
                      className="p-2 rounded-full hover:bg-gray-600 transition duration-300"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === driver.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(driver);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(driver);
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

          {selectedDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 text-gray-100 p-8 rounded-2xl max-w-md w-full relative shadow-2xl">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  onClick={() => setSelectedDriver(null)}
                >
                  <X size={24} />
                </button>
                <div className="flex items-center mb-6">
                  <img 
                    src={selectedDriver.image} 
                    alt={selectedDriver.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mr-4"
                    onError={(e) => {
                      console.error(`Error loading image for driver ${selectedDriver.name}:`, e);
                      e.target.src = 'https://via.placeholder.com/150'; // Provide a fallback image
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400">{selectedDriver.name}</h2>
                    <p className="text-gray-400">{selectedDriver.driverId}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Truck size={20} className="text-blue-500 mr-2" />
                    <p><span className="font-semibold">Truck ID:</span> {selectedDriver.truckId}</p>
                  </div>
                  <div className="flex items-center">
                    <FileText size={20} className="text-blue-500 mr-2" />
                    <p><span className="font-semibold">License Number:</span> {selectedDriver.licenseNumber}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="text-blue-500 mr-2" />
                    <p><span className="font-semibold">Contact:</span> {selectedDriver.contactNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}