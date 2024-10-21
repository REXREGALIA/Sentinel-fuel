import React, { useState } from 'react'
import { PlusCircle, X, Upload, Truck, Phone, FileText, Menu } from 'lucide-react'
import Navbar from './Navbar'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked')
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex">
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
            onClick={() => setShowForm(true)}
          >
            <span className="font-semibold">Add New Driver</span>
            <PlusCircle />
          </button>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 text-gray-100 rounded-2xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  onClick={() => setShowForm(false)}
                >
                  <X size={24} />
                </button>
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Add New Driver</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (form fields remain the same) ... */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-gray-100 rounded-md hover:bg-blue-700 transition duration-300 font-medium text-lg shadow-md"
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
              <div key={driver.driverId} className="flex flex-col items-center bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition duration-300">
                <div className="relative w-32 h-32 mb-4">
                  <img src={driver.image} alt={driver.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{driver.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{driver.driverId}</p>
                <button
                  onClick={() => handleDriverClick(driver)}
                  className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

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
                  <img src={selectedDriver.image} alt={selectedDriver.name} className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mr-4" />
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
  )
}