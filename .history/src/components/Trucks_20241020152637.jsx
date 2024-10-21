import React, { useState } from 'react'
import { PlusCircle, X, Upload, Truck as TruckIcon } from 'lucide-react'

export default function Trucks() {
  const [trucks, setTrucks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [formData, setFormData] = useState({
    truckId: '',
    model: '',
    capacity: '',
    licensePlate: '',
    image: '',
    lastMaintenance: '',
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

    const newTruck = { ...formData }

    setTrucks(prevTrucks => {
      const truckExists = prevTrucks.some(truck => truck.truckId === newTruck.truckId)
      if (truckExists) {
        alert('A truck with this Truck ID already exists!')
        return prevTrucks 
      }
      return [...prevTrucks, newTruck] 
    })

    setShowForm(false)

    setFormData({
      truckId: '',
      model: '',
      capacity: '',
      licensePlate: '',
      image: '',
    })
  }

  const handleTruckClick = (truck) => {
    setSelectedTruck(truck)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Truck Management
      </h1>

      <button
        className="mb-8 px-6 py-3 bg-blue-500 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
        onClick={() => setShowForm(true)}
      >
        <span>Add New Truck</span>
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
              <h2 className="text-3xl font-bold mb-6 text-center text-white">Add New Truck</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label htmlFor="model" className="block text-sm font-medium text-gray-300">Model</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., Volvo FH16"
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">Capacity (Liters)</label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="e.g., 40000"
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-300">License Plate</label>
                    <input
                      type="text"
                      id="licensePlate"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleChange}
                      placeholder="e.g., ABC 1234"
                      className="w-full p-3 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-300 cursor-pointer">Truck Image</label>
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
                      <img src={formData.image} alt="Preview" className="w-12 h-12 mx-5 object-cover rounded-md" />
                    ) : (
                      <div className=""></div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-medium text-lg"
                >
                  Add Truck
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {trucks.map((truck) => (
          <div key={truck.truckId} className="flex flex-col items-center">
            <div className="truck-image-container relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden hover:ring-4 hover:ring-blue-500 transition duration-300">
              <button
                onClick={() => handleTruckClick(truck)}
                className="w-full h-full"
              >
                <img src={truck.image} alt={truck.truckId} className="w-full h-full object-cover" />
              </button>
            </div>
            <p className="mt-2 text-center text-lg">{truck.truckId}</p>
          </div>
        ))}
      </div>

      {selectedTruck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedTruck(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedTruck.truckId}</h2>
            <img src={selectedTruck.image} alt={selectedTruck.truckId} className="w-64 h-64 mx-auto mb-4 object-cover rounded-lg" />
            <div className="space-y-2">
              <p><strong>Model:</strong> {selectedTruck.model}</p>
              <p><strong>Capacity:</strong> {selectedTruck.capacity} Liters</p>
              <p><strong>License Plate:</strong> {selectedTruck.licensePlate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}