import React, { useState } from 'react'
import { PlusCircle, X, Upload, Truck, Phone, IdCard, License } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-8">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
        Driver Fleet
      </h1>

      <button
        className="mb-8 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center space-x-2 hover:from-green-500 hover:to-blue-600 transition duration-300 shadow-lg transform hover:-translate-y-1"
        onClick={() => setShowForm(true)}
      >
        <span className="font-semibold">Add New Driver</span>
        <PlusCircle />
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-800 rounded-2xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              onClick={() => setShowForm(false)}
            >
              <X size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Add New Driver</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., John Doe"
                      className="w-full p-3 bg-gray-100 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="driverId" className="block text-sm font-medium text-gray-700">Driver ID</label>
                    <input
                      type="text"
                      id="driverId"
                      name="driverId"
                      value={formData.driverId}
                      onChange={handleChange}
                      placeholder="e.g., DRV-001"
                      className="w-full p-3 bg-gray-100 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="truckId" className="block text-sm font-medium text-gray-700">Truck ID</label>
                    <input
                      type="text"
                      id="truckId"
                      name="truckId"
                      value={formData.truckId}
                      onChange={handleChange}
                      placeholder="e.g., TRK-001"
                      className="w-full p-3 bg-gray-100 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="e.g., DL12345678"
                      className="w-full p-3 bg-gray-100 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 cursor-pointer">Driver Image</label>
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
                      className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md cursor-pointer hover:bg-indigo-600 transition duration-200 text-sm"
                    >
                      <Upload size={18} className="mr-2" />
                      Choose File
                    </label>
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-12 h-12 mx-5 object-cover rounded-full border-2 border-indigo-500" />
                    ) : (
                      <div className="w-12 h-12 mx-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="e.g., +91 1234567890"
                    className="w-full p-3 bg-gray-100 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 font-medium text-lg shadow-md"
                >
                  Add Driver
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {drivers.map((driver) => (
          <div key={driver.driverId} className="flex flex-col items-center bg-white bg-opacity-10 p-6 rounded-xl backdrop-filter backdrop-blur-lg hover:bg-opacity-20 transition duration-300">
            <div className="relative w-32 h-32 mb-4">
              <img src={driver.image} alt={driver.name} className="w-full h-full object-cover rounded-full border-4 border-yellow-400" />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
                <Truck size={20} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{driver.name}</h3>
            <p className="text-sm text-gray-300 mb-4">{driver.driverId}</p>
            <button
              onClick={() => handleDriverClick(driver)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-sm font-medium hover:from-pink-600 hover:to-red-600 transition duration-300"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-800 p-8 rounded-2xl max-w-md w-full relative shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              onClick={() => setSelectedDriver(null)}
            >
              <X size={24} />
            </button>
            <div className="flex items-center mb-6">
              <img src={selectedDriver.image} alt={selectedDriver.name} className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-indigo-600">{selectedDriver.name}</h2>
                <p className="text-gray-600">{selectedDriver.driverId}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Truck size={20} className="text-indigo-500 mr-2" />
                <p><span className="font-semibold">Truck ID:</span> {selectedDriver.truckId}</p>
              </div>
              <div className="flex items-center">
                <License size={20} className="text-indigo-500 mr-2" />
                <p><span className="font-semibold">License Number:</span> {selectedDriver.licenseNumber}</p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-indigo-500 mr-2" />
                <p><span className="font-semibold">Contact:</span> {selectedDriver.contactNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}