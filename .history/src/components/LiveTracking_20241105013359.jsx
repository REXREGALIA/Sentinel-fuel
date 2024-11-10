import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';
import { Truck, Fuel, MapPin, Clock, AlertTriangle } from 'lucide-react';

export default function LiveTracking() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Fetch trucks and pumps
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const trucksQuery = query(collection(db, 'trucks'), where("userId", "==", user.uid));
        const pumpsQuery = query(collection(db, 'petrolStations'), where("userId", "==", user.uid));
        
        const [trucksSnapshot, pumpsSnapshot] = await Promise.all([
          getDocs(trucksQuery),
          getDocs(pumpsQuery)
        ]);

        setTrucks(trucksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setPumps(pumpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getCoordinates = (location) => {
    if (location.locationType === 'coordinates') {
      return {
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude)
      };
    } else {
      // Simple zip code mapping (replace with actual geocoding in production)
      const zipCoordinates = {
        '560001': { lat: 12.9716, lng: 77.5946 },
        '560002': { lat: 12.9815, lng: 77.5921 },
      };
      return zipCoordinates[location.zipCode] || { lat: 12.9716, lng: 77.5946 };
    }
  };

  const startTracking = () => {
    if (!selectedTruck || !selectedPump) {
      toast.error('Please select both truck and destination');
      return;
    }

    try {
      setIsTracking(true);
      
      const startPosition = getCoordinates(selectedTruck);
      const endPosition = getCoordinates(selectedPump);
      
      const totalDistance = calculateDistance(
        startPosition.lat,
        startPosition.lng,
        endPosition.lat,
        endPosition.lng
      );

      setTracking({
        currentPosition: startPosition,
        endPosition: endPosition,
        distanceCovered: 0,
        totalDistance: totalDistance,
        fuelLevel: parseFloat(selectedTruck.capacity) || 5000,
        estimatedTimeArrival: `${Math.round(totalDistance * 2)} mins`,
        status: 'On Route',
        startAddress: selectedTruck.address,
        endAddress: selectedPump.address
      });

      // Update position every 5 seconds
      const interval = setInterval(() => {
        setTracking(prev => {
          if (!prev) return null;

          const progress = prev.distanceCovered / prev.totalDistance;
          
          if (progress >= 1) {
            clearInterval(interval);
            return {
              ...prev,
              currentPosition: prev.endPosition,
              status: 'Arrived',
              estimatedTimeArrival: 'Arrived'
            };
          }

          const newLat = prev.currentPosition.lat + 
            (prev.endPosition.lat - prev.currentPosition.lat) * 0.1;
          const newLng = prev.currentPosition.lng + 
            (prev.endPosition.lng - prev.currentPosition.lng) * 0.1;

          const distance = calculateDistance(
            prev.currentPosition.lat,
            prev.currentPosition.lng,
            newLat,
            newLng
          );

          const fuelConsumed = distance * 0.1;

          return {
            ...prev,
            currentPosition: { lat: newLat, lng: newLng },
            distanceCovered: prev.distanceCovered + distance,
            fuelLevel: prev.fuelLevel - fuelConsumed,
            estimatedTimeArrival: `${Math.round((prev.totalDistance - prev.distanceCovered) * 2)} mins`
          };
        });
      }, 5000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error starting tracking:', error);
      toast.error('Failed to start tracking');
      setIsTracking(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Live Tracking Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Truck className="mr-2" /> Select Truck
            </h2>
            <select 
              className="w-full bg-gray-700 p-3 rounded"
              onChange={(e) => setSelectedTruck(trucks.find(t => t.id === e.target.value))}
            >
              <option value="">Select a truck</option>
              {trucks.map(truck => (
                <option key={truck.id} value={truck.id}>
                  {truck.truckId} - {truck.address}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" /> Select Destination
            </h2>
            <select 
              className="w-full bg-gray-700 p-3 rounded"
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

        <button
          onClick={startTracking}
          disabled={isTracking}
          className={`w-full mb-8 py-4 rounded-lg font-semibold text-xl ${
            isTracking 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isTracking ? 'Tracking in Progress' : 'Start Tracking'}
        </button>

        {tracking && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Live Tracking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Current Position</h3>
                <p>Lat: {tracking.currentPosition.lat.toFixed(4)}</p>
                <p>Lng: {tracking.currentPosition.lng.toFixed(4)}</p>
                <p className="mt-2">{tracking.startAddress}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Destination</h3>
                <p>Lat: {tracking.endPosition.lat.toFixed(4)}</p>
                <p>Lng: {tracking.endPosition.lng.toFixed(4)}</p>
                <p className="mt-2">{tracking.endAddress}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Distance</h3>
                <p>{tracking.distanceCovered.toFixed(2)} km / {tracking.totalDistance.toFixed(2)} km</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Fuel Level</h3>
                <p>{tracking.fuelLevel.toFixed(2)} L</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">ETA</h3>
                <p>{tracking.estimatedTimeArrival}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <p>{tracking.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}