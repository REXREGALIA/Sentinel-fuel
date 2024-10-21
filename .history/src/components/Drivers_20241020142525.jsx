import React, { useState } from 'react'
import { PlusCircle, X, Upload, Truck } from 'lucide-react'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    driverId: '',
    truckId: '',
    licenseNumber: '',
    image: '',
    contactNumber: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newDriver = { ...formData }

    setDrivers(prevDrivers => {
      const driverExists = prevDrivers.some(driver => driver.driverId === newDriver.driverId)
      if (driverExists) {
        alert('A driver with this Driver ID already exists!')
        return prevDrivers 
      }
      return [...prevDrivers, newDriver] 
    })

    setShowForm(false)

    setFormData({
      name: '',
      driverId: '',
      truckId: '',
      licenseNumber: '',
      image: '',
      contactNumber: '',
    })
  }

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <style jsx global>{`
        @keyframes rotateTruck {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateY(-40px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateY(-40px); }
        }
        .driver-image-container:hover .truck-icon {
          opacity: 1;
          animation: rotateTruck 3s linear infinite;
        }
      `}</style>

      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Drivers Management
      </h1>

      <button
        className="mb-8 px-6 py-3 bg-blue-500 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
        onClick={() => setShowForm(true)}
      >
        <span>Add New Driver</span>
        <PlusCircle />
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setShowForm(false)}
            >
              <X size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-white">Add New Driver</h2>
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
                      placeholder="e.g., Pintu"
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
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
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                      required
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
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
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
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
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
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prevData => ({ ...prevData, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 text-sm"
                    >
                      <Upload size={18} className="mr-2" />
                      Choose File
                    </label>
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-12 h-12 mx-5 object-cover rounded-full" />
                    ) : (
                      <div className=""></div>
                    )}
                  </div>
                </div>
                <div className="">
                  <div className="space-y-2">
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">Contact Number</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="e.g., +91 1234389001"
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-medium text-lg"
                >
                  Add Driver
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {drivers.map((driver) => (
          <div key={driver.driverId} className="flex flex-col items-center">
            <div className="driver-image-container relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden hover:ring-4 hover:ring-blue-500 transition duration-300">
              <button
                onClick={() => handleDriverClick(driver)}
                className="w-full h-full"
              >
                <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
              </button>
              <div className="truck-icon absolute top--1/2 left--1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300">
                <Truck size={24} className="text-yellow-500" />
              </div>
            </div>
            <p className="mt-2 text-center text-lg">{driver.name}</p>
          </div>
        ))}
      </div>

      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedDriver(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedDriver.name}</h2>
            <img src={selectedDriver.image} alt={selectedDriver.name} className="w-64 h-64 mx-auto mb-4 object-cover rounded-lg" />
            <div className="space-y-2">
              <p><strong>Driver ID:</strong> {selectedDriver.driverId}</p>
              <p><strong>Truck ID:</strong> {selectedDriver.truckId}</p>
              <p><strong>License Number:</strong> {selectedDriver.licenseNumber}</p>
              <p><strong>Contact Number:</strong> {selectedDriver.contactNumber}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}