import React, { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'

interface Driver {
  id: string;
  name: string;
  driverId: string;
  truckId: string;
  licenseNumber: string;
  image: string;
  contactNumber: string;
  currentLocation: string;
  fuelInTank: number;
}

export default function DriversComponent() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [formData, setFormData] = useState<Driver>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver)
    // Simulating route change
    console.log(`Navigating to /driver/${driver.name.toLowerCase().replace(' ', '_')}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
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
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowForm(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Add New Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="text"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                placeholder="Driver ID"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="text"
                name="truckId"
                value={formData.truckId}
                onChange={handleChange}
                placeholder="Truck ID"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="License Number"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="text"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                placeholder="Current Location"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <input
                type="number"
                name="fuelInTank"
                value={formData.fuelInTank}
                onChange={handleChange}
                placeholder="Fuel in Tank (L)"
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
              <button type="submit" className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300">
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