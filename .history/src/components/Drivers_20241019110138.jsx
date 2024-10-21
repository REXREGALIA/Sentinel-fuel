import React, { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    driverId: '',
    truckId: '',
    licenseNumber: '',
    image: '',
    contactNumber: '',
    currentLocation: '',
    fuelInTank: 0
  })

  const handleChange = (e) => {
    const value = e.target.name === 'fuelInTank' ? parseFloat(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newDriver = { ...formData, id: Date.now().toString() }
    setDrivers([...drivers, newDriver])
    setShowForm(false)
    setFormData({
      id: '',
      name: '',
      driverId: '',
      truckId: '',
      licenseNumber: '',
      image: '',
      contactNumber: '',
      currentLocation: '',
      fuelInTank: 0
    })
  }

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
    // Simulating route change
    console.log(`Navigating to /driver/${driver.name.toLowerCase().replace(' ', '_')}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full relative shadow-lg">
  <button
    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
    onClick={() => setShowForm(false)}
  >
    <X size={24} />
  </button>
  <h2 className="text-3xl font-bold mb-6 text-center text-white">Add New Driver</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="space-y-2">
      <label htmlFor="name" className="block text-lg font-medium text-gray-300">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="driverId" className="block text-lg font-medium text-gray-300">Driver ID</label>
      <input
        type="text"
        id="driverId"
        name="driverId"
        value={formData.driverId}
        onChange={handleChange}
        className="w-full p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="truckId" className="block text-lg font-medium text-gray-300">Truck ID</label>
      <input
        type="text"
        id="truckId"
        name="truckId"
        value={formData.truckId}
        onChange={handleChange}
        className="w-full p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
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
        className="w-full p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="image" className="block text-sm font-medium text-gray-300">Driver Image</label>
      <div className="flex items-center space-x-4">
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
                setFormData({ ...formData, image: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />
        <label
          htmlFor="image"
          className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-200"
        >
          Choose File
        </label>
        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-full" />
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
        className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-300">Current Location</label>
      <input
        type="text"
        id="currentLocation"
        name="currentLocation"
        value={formData.currentLocation}
        onChange={handleChange}
        className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="fuelInTank" className="block text-sm font-medium text-gray-300">Fuel in Tank (L)</label>
      <input
        type="number"
        id="fuelInTank"
        name="fuelInTank"
        value={formData.fuelInTank}
        onChange={handleChange}
        className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-medium"
    >
      Add Driver
    </button>
  </form>
</div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {drivers.map((driver) => (
          <div key={driver.id} className="flex flex-col items-center">
            <button
              onClick={() => handleDriverClick(driver)}
              className="w-24 h-24 rounded-full overflow-hidden hover:ring-4 hover:ring-blue-500 transition duration-300"
            >
              <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
            </button>
            <p className="mt-2 text-center">{driver.name}</p>
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
            <img src={selectedDriver.image} alt={selectedDriver.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <div className="space-y-2">
              <p><strong>Driver ID:</strong> {selectedDriver.driverId}</p>
              <p><strong>Truck ID:</strong> {selectedDriver.truckId}</p>
              <p><strong>License Number:</strong> {selectedDriver.licenseNumber}</p>
              <p><strong>Contact Number:</strong> {selectedDriver.contactNumber}</p>
              <p><strong>Current Location:</strong> {selectedDriver.currentLocation}</p>
              <p><strong>Fuel in Tank:</strong> {selectedDriver.fuelInTank} L</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}