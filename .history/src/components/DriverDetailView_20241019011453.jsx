import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function DriverDetailView() {
  const { driverName } = useParams()
  const [driver, setDriver] = useState(null)

  useEffect(() => {
    // In a real application, you would fetch the driver data from an API
    // For this example, we'll use mock data
    const mockDriver = {
      id: 1,
      name: "John Doe",
      contact: "123-456-7890",
      licenseNumber: "DL12345",
      truckRegNumber: "TR-001",
      truckCapacity: 5000,
      emergencyContact: "987-654-3210",
      image: "https://example.com/john-doe.jpg"
    }
    setDriver(mockDriver)
  }, [driverName])

  if (!driver) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 p-8">
      <Link to="/" className="text-blue-400 hover:underline mb-4 inline-block">&larr; Back to Drivers List</Link>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <img src={driver.image} alt={driver.name} className="w-24 h-24 rounded-full mr-6 object-cover" />
          <h1 className="text-3xl font-bold text-gray-100">{driver.name}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <p><span className="font-medium">Contact:</span> {driver.contact}</p>
          <p><span className="font-medium">License:</span> {driver.licenseNumber}</p>
          <p><span className="font-medium">Truck:</span> {driver.truckRegNumber}</p>
          <p><span className="font-medium">Capacity:</span> {driver.truckCapacity} L</p>
          <p><span className="font-medium">Emergency Contact:</span> {driver.emergencyContact}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Live Tracking</h2>
          <p>This is where the live tracking feature would be implemented.</p>
          {/* Add your live tracking component or integration here */}
        </div>
      </div>
    </div>
  )
}