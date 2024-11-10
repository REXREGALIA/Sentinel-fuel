import React, { useState, useEffect } from 'react'
import { db, auth } from '../Firebase'
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
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user logged in');
        }

        // Query with userId filter
        const trucksQuery = query(
          collection(db, 'trucks'), 
          where("userId", "==", user.uid)
        );
        
        const pumpsQuery = query(
          collection(db, 'petrolStations'), 
          where("userId", "==", user.uid)
        );
        
        const [trucksSnapshot, pumpsSnapshot] = await Promise.all([
          getDocs(trucksQuery),
          getDocs(pumpsQuery)
        ]);

        setTrucks(trucksSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })));
        
        setPumps(pumpsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

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

  // Modified getCoordinates function to use actual data
  const getCoordinates = async (location) => {
    if (!location) return null;
    
    try {
      if (location.locationType === 'coordinates') {
        return {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude)
        };
      } else if (location.locationType === 'zipcode') {
        // In production, use a real geocoding service
        // For demo, we'll use a more extensive zip code mapping
        const response = await fetch(`https://api.postalpincode.in/pincode/${location.zipCode}`);
        const data = await response.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          return {
            lat: parseFloat(postOffice.Latitude),
            lng: parseFloat(postOffice.Longitude)
          };
        }
      }
      throw new Error('Invalid location data');
    } catch (error) {
      console.error('Error getting coordinates:', error);
      toast.error('Error getting location coordinates');
      return null;
    }
  };

  // Modified startTracking function
  const startTracking = async () => {
    if (!selectedTruck || !selectedPump) {
      toast.error('Please select both truck and destination');
      return;
    }

    try {
      setIsTracking(true);
      
      // Get coordinates for both locations
      const startPosition = await getCoordinates(selectedTruck);
      const endPosition = await getCoordinates(selectedPump);

      if (!startPosition || !endPosition) {
        throw new Error('Could not determine locations');
      }

      // Calculate total distance
      const totalDistance = calculateDistance(
        startPosition.lat,
        startPosition.lng,
        endPosition.lat,
        endPosition.lng
      );

      // Calculate estimated time (assuming average speed of 40 km/h)
      const estimatedTimeMinutes = Math.round((totalDistance / 40) * 60);

      // Set static tracking information
      setTracking({
        currentPosition: startPosition, // Truck's position (won't change)
        endPosition: endPosition,
        totalDistance: totalDistance,
        fuelInTank: parseFloat(selectedTruck.capacity) || 5000, // Static fuel amount
        estimatedTime: `${estimatedTimeMinutes} minutes`,
        status: 'Ready to depart',
        startAddress: selectedTruck.address,
        endAddress: selectedPump.address
      });

    } catch (error) {
      console.error('Error starting tracking:', error);
      toast.error('Failed to start tracking');
      setIsTracking(false);
    }
  };

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
            <h2 className="text-2xl font-semibold mb-6 text-center">Tracking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <MapPin className="mr-2" /> Truck Location
                </h3>
                <p className="text-xl">
                  Lat: {tracking.currentPosition.lat.toFixed(4)}
                </p>
                <p className="text-xl">
                  Lng: {tracking.currentPosition.lng.toFixed(4)}
                </p>
                <p className="mt-2 text-sm text-gray-400">{tracking.startAddress}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Truck className="mr-2" /> Distance to Destination
                </h3>
                <p className="text-3xl">{tracking.totalDistance.toFixed(2)} km</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Fuel className="mr-2" /> Fuel in Tank
                </h3>
                <p className="text-3xl">{tracking.fuelInTank.toFixed(2)} L</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Clock className="mr-2" /> Estimated Travel Time
                </h3>
                <p className="text-3xl">{tracking.estimatedTime}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <p className="text-3xl">Arriving</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Destination</h3>
                <p className="text-xl">{tracking.endAddress}</p>
                <p className="mt-2 text-sm text-gray-400">
                  Lat: {tracking.endPosition.lat.toFixed(4)}, 
                  Lng: {tracking.endPosition.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}