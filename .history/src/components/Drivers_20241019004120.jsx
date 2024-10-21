import React, { useState } from 'react'
import { PlusCircle, Edit, Trash2, X } from 'lucide-react'

// ... existing code ...

export default function DriversComponent() {
  // ... existing state and handlers ...

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-gray-800 py-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Manage Drivers
        </h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            className="px-6 py-3 bg-blue-500 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
            onClick={() => {
              setShowForm(!showForm)
              setEditingDriver(null)
              setFormData({
                name: "",
                contact: "",
                licenseNumber: "",
                truckRegNumber: "",
                truckCapacity: "",
                emergencyContact: "",
              })
            }}
          >
            <span>{showForm ? "Cancel" : "Add New Driver"}</span>
            {showForm ? <X /> : <PlusCircle />}
          </button>
          <p className="text-gray-400">Total Drivers: {drivers.length}</p>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">{editingDriver ? "Edit Driver" : "Add New Driver"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... existing form inputs ... */}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition duration-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300">
                  {editingDriver ? 'Save Changes' : 'Add Driver'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{driver.name}</h3>
              <div className="space-y-1 text-gray-300">
                <p>Contact: {driver.contact}</p>
                <p>License: {driver.licenseNumber}</p>
                <p>Truck: {driver.truckRegNumber}</p>
                <p>Capacity: {driver.truckCapacity} L</p>
                <p>Emergency: {driver.emergencyContact}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => handleEdit(driver)} className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(driver.id)} className="p-2 bg-red-500 rounded hover:bg-red-600 transition duration-300">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}