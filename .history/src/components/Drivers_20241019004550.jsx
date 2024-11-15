import React, { useState } from 'react'
import { PlusCircle, Edit, Trash2, X, Search } from 'lucide-react'

const initialDrivers = []

export default function DriversComponent() {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [showForm, setShowForm] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    licenseNumber: "",
    truckRegNumber: "",
    truckCapacity: "",
    emergencyContact: "",
  })

  const [searchTerm, setSearchTerm] = useState("")

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDriver) {
      setDrivers(drivers.map(driver => driver.id === editingDriver.id ? { ...formData, id: editingDriver.id } : driver))
    } else {
      setDrivers([...drivers, { ...formData, id: drivers.length + 1 }])
    }
    setShowForm(false)
    setEditingDriver(null)
    setFormData({
      name: "",
      contact: "",
      licenseNumber: "",
      truckRegNumber: "",
      truckCapacity: "",
      emergencyContact: "",
    })
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setFormData(driver)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setDrivers(drivers.filter(driver => driver.id !== id))
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Driver Management
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search drivers..."
                className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-full flex items-center space-x-2 hover:bg-blue-600 transition duration-300"
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
              {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{editingDriver ? "Edit Driver" : "Add New Driver"}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Driver Name"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="License Number"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  name="truckRegNumber"
                  value={formData.truckRegNumber}
                  onChange={handleChange}
                  placeholder="Truck Registration Number"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  name="truckCapacity"
                  value={formData.truckCapacity}
                  onChange={handleChange}
                  placeholder="Truck Capacity (in liters)"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency Contact"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                    {editingDriver ? 'Save Changes' : 'Add Driver'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{driver.name}</h3>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">Contact:</span> {driver.contact}</p>
                  <p><span className="font-medium">License:</span> {driver.licenseNumber}</p>
                  <p><span className="font-medium">Truck:</span> {driver.truckRegNumber}</p>
                  <p><span className="font-medium">Capacity:</span> {driver.truckCapacity} L</p>
                  <p><span className="font-medium">Emergency:</span> {driver.emergencyContact}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => handleEdit(driver)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition duration-300">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(driver.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-300">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
