import React, { useState } from 'react'
import { PlusCircle, Edit, Trash2, X, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

// Mock data for demonstration
const initialDrivers = [
  { id: 1, name: "John Doe", contact: "123-456-7890", licenseNumber: "DL12345", truckRegNumber: "TR-001", truckCapacity: 5000, emergencyContact: "987-654-3210", image: "https://example.com/john-doe.jpg" },
  { id: 2, name: "Jane Smith", contact: "098-765-4321", licenseNumber: "DL67890", truckRegNumber: "TR-002", truckCapacity: 7000, emergencyContact: "123-456-7890", image: "https://example.com/jane-smith.jpg" },
]

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
    image: "",
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
      image: "",
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
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-100">
            Driver Management
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search drivers..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
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
                  image: "",
                })
              }}
            >
              <span>{showForm ? "Cancel" : "Add New Driver"}</span>
              {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{editingDriver ? "Edit Driver" : "Add New Driver"}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Driver Name"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="License Number"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <input
                  type="text"
                  name="truckRegNumber"
                  value={formData.truckRegNumber}
                  onChange={handleChange}
                  placeholder="Truck Registration Number"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <input
                  type="number"
                  name="truckCapacity"
                  value={formData.truckCapacity}
                  onChange={handleChange}
                  placeholder="Truck Capacity (in liters)"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency Contact"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Driver Image URL"
                  className="p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                  required
                />
                <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition duration-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                    {editingDriver ? 'Save Changes' : 'Add Driver'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <Link to={`/driver/${driver.name.toLowerCase().replace(' ', '-')}`} key={driver.id} className="bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
                <div className="flex items-center mb-4">
                  <img src={driver.image} alt={driver.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                  <h3 className="text-xl font-semibold text-gray-100">{driver.name}</h3>
                </div>
                <div className="space-y-1 text-gray-300">
                  <p><span className="font-medium">Contact:</span> {driver.contact}</p>
                  <p><span className="font-medium">License:</span> {driver.licenseNumber}</p>
                  <p><span className="font-medium">Truck:</span> {driver.truckRegNumber}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={(e) => { e.preventDefault(); handleEdit(driver); }} className="p-2 bg-blue-600 text-blue-100 rounded hover:bg-blue-700 transition duration-300">
                    <Edit size={18} />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(driver.id); }} className="p-2 bg-red-600 text-red-100 rounded hover:bg-red-700 transition duration-300">
                    <Trash2 size={18} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
