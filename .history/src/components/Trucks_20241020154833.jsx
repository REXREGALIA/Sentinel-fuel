import React, { useState } from 'react'
import { PlusCircle, X, Upload, Truck } from 'lucide-react'

export default function Trucks() {
  // ... (keep all the existing state and functions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-5xl font-bold mb-10 text-center">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Truck Fleet Management
        </span>
      </h1>

      <button
        className="mb-8 px-6 py-3 bg-blue-600 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        onClick={() => setShowForm(true)}
      >
        <span className="text-lg">Add New Truck</span>
        <PlusCircle size={24} />
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setShowForm(false)}
            >
              <X size={28} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Add New Truck</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Keep the existing form fields, but update their styling */}
                  <div className="space-y-2">
                    <label htmlFor="truckId" className="block text-sm font-medium text-gray-300">Truck ID</label>
                    <input
                      type="text"
                      id="truckId"
                      name="truckId"
                      value={formData.truckId}
                      onChange={handleChange}
                      placeholder="e.g., TRK-001"
                      className="w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 border border-gray-600"
                      required
                    />
                  </div>
                  {/* Repeat for other input fields... */}
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
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 text-sm shadow-md"
                    >
                      <Upload size={18} className="mr-2" />
                      Choose File
                    </label>
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-16 h-16 mx-5 object-cover rounded-lg border-2 border-blue-400" />
                    ) : (
                      <div className="w-16 h-16 mx-5 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Truck size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Add Truck
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {trucks.map((truck) => (
          <div key={truck.truckId} className="flex flex-col items-center bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="truck-image-container relative w-full aspect-square rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => handleTruckClick(truck)}
                className="w-full h-full"
              >
                <img src={truck.image} alt={truck.truckId} className="w-full h-full object-cover" />
              </button>
            </div>
            <p className="text-center text-lg font-semibold text-blue-400">{truck.truckId}</p>
            <p className="text-sm text-gray-400">{truck.model}</p>
          </div>
        ))}
      </div>

      {selectedTruck && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full relative shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setSelectedTruck(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-4 text-blue-400">{selectedTruck.truckId}</h2>
            <img src={selectedTruck.image} alt={selectedTruck.truckId} className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" />
            <div className="space-y-3 text-lg">
              <p><span className="font-semibold text-gray-400">Model:</span> {selectedTruck.model}</p>
              <p><span className="font-semibold text-gray-400">Capacity:</span> {selectedTruck.capacity} Liters</p>
              <p><span className="font-semibold text-gray-400">License Plate:</span> {selectedTruck.licensePlate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}