import React, { useState, useEffect } from 'react'
import { db } from '../Firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { toast } from 'sonner'
import { Truck, Fuel, MapPin, Clock, AlertTriangle } from 'lucide-react'

export default function LiveTracking() {
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [selectedPump, setSelectedPump] = useState(null)
  const [trucks, setTrucks] = useState([])
  const [pumps, setPumps] = useState([])
  const [tracking, setTracking] = useState(null)
  const [isTracking, setIsTracking] = useState(false)

  // Fetch trucks and pumps
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trucksQuery = query(collection(db, 'trucks'))
        const pumpsQuery = query(collection(db, 'petrolStations'))
        
        const [trucksSnapshot, pumpsSnapshot] = await Promise.all([
          getDocs(trucksQuery),
          getDocs(pumpsQuery)
        ])

        setTrucks(trucksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setPumps(pumpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        toast.error('Error fetching data')
      }
    }

    fetchData()
  }, [])

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Simulate truck movement
  const startTracking = () => {
    if (!selectedTruck || !selectedPump) {
      toast.error('Please select both truck and destination')
      return
    }

    setIsTracking(true)
    
    // Simulate initial position (Bangalore coordinates as example)
    const startPosition = { lat: 12.9716, lng: 77.5946 }
    const endPosition = { lat: 13.0827, lng: 77.5877 } // Example destination
    
    // Initial tracking state
    setTracking({
      currentPosition: startPosition,
      distanceCovered: 0,
      fuelLevel: 5000, // Example initial fuel level in liters
      estimatedTimeArrival: '30 mins',
      status: 'On Route'
    })

    // Update position every 5 seconds
    const interval = setInterval(() => {
      setTracking(prev => {
        if (!prev) return null

        // Simulate movement and fuel consumption
        const newLat = prev.currentPosition.lat + (Math.random() * 0.001)
        const newLng = prev.currentPosition.lng + (Math.random() * 0.001)
        const distance = calculateDistance(
          prev.currentPosition.lat,
          prev.currentPosition.lng,
          newLat,
          newLng
        )

        // Simulate fuel consumption (0.1L per km)
        const fuelConsumed = distance * 0.1

        return {
          currentPosition: { lat: newLat, lng: newLng },
          distanceCovered: prev.distanceCovered + distance,
          fuelLevel: prev.fuelLevel - fuelConsumed,
          estimatedTimeArrival: '25 mins', // Update based on distance
          status: 'On Route'
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Live Tracking Dashboard</h1>

        {/* Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Truck className="mr-2" /> Select Truck
            </h2>
            <select 
              className="w-full bg-gray-700 p-3 rounded text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              onChange={(e) => setSelectedTruck(trucks.find(t => t.id === e.target.value))}
            >
              <option value="">Select a truck</option>
              {trucks.map(truck => (
                <option key={truck.id} value={truck.id}>
                  {truck.truckId} - {truck.model}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" /> Select Destination
            </h2>
            <select 
              className="w-full bg-gray-700 p-3 rounded text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              onChange={(e) => setSelectedPump(pumps.find(p => p.id === e.target.value))}
            >
              <option value="">Select a petrol pump</option>
              {pumps.map(pump => (
                <option key={pump.id} value={pump.id}>
                  {pump.name} - {pump.address}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Tracking Button */}
        <button
          onClick={startTracking}
          disabled={isTracking}
          className={`w-full mb-8 py-4 rounded-lg font-semibold text-xl transition duration-200 ${
            isTracking 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none'
          }`}
        >
          {isTracking ? 'Tracking in Progress' : 'Start Tracking'}
        </button>

        {/* Tracking Information */}
        {tracking && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center">Live Tracking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <MapPin className="mr-2" /> Current Position
                </h3>
                <p className="text-2xl">
                  Lat: {tracking.currentPosition.lat.toFixed(4)}
                </p>
                <p className="text-2xl">
                  Lng: {tracking.currentPosition.lng.toFixed(4)}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Truck className="mr-2" /> Distance Covered
                </h3>
                <p className="text-3xl">{tracking.distanceCovered.toFixed(2)} km</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Fuel className="mr-2" /> Fuel Level
                </h3>
                <p className="text-3xl">{tracking.fuelLevel.toFixed(2)} L</p>
                {tracking.fuelLevel < 1000 && (
                  <p className="text-yellow-400 flex items-center mt-2">
                    <AlertTriangle className="mr-1" /> Low fuel warning
                  </p>
                )}
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Clock className="mr-2" /> Estimated Time of Arrival
                </h3>
                <p className="text-3xl">{tracking.estimatedTimeArrival}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg col-span-2">
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <p className="text-3xl">{tracking.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}