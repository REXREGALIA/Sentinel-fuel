import React, { useState, useEffect } from "react";
import { db, auth } from '../Firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from "sonner";

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    truckNumber: '',
    model: '',
    capacity: '',
    manufacturer: '',
    yearOfManufacture: '',
    registrationNumber: '',
    insuranceNumber: '',
    lastMaintenanceDate: ''
  });

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      const trucksRef = collection(db, "trucks");
      const q = query(trucksRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const trucksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTrucks(trucksList);
    } catch (error) {
      console.error("Error fetching trucks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const truckData = {
        ...formData,
        userId: user.uid,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "trucks"), truckData);
      await fetchTrucks();
      
      // Reset form
      setFormData({
        truckNumber: '',
        model: '',
        capacity: '',
        manufacturer: '',
        yearOfManufacture: '',
        registrationNumber: '',
        insuranceNumber: '',
        lastMaintenanceDate: ''
      });
      
      toast.success('Truck added successfully');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to add truck');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Trucks Management</h1>

        {/* Add Truck Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Truck</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Truck Number</label>
              <input
                type="text"
                name="truckNumber"
                value={formData.truckNumber}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Capacity</label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Year of Manufacture</label>
              <input
                type="text"
                name="yearOfManufacture"
                value={formData.yearOfManufacture}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Insurance Number</label>
              <input
                type="text"
                name="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Last Maintenance Date</label>
              <input
                type="date"
                name="lastMaintenanceDate"
                value={formData.lastMaintenanceDate}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Truck
              </button>
            </div>
          </form>
        </div>

        {/* Trucks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map(truck => (
            <div key={truck.id} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{truck.truckNumber}</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Model:</span> {truck.model}</p>
                <p><span className="font-semibold">Capacity:</span> {truck.capacity}</p>
                <p><span className="font-semibold">Manufacturer:</span> {truck.manufacturer}</p>
                <p><span className="font-semibold">Year:</span> {truck.yearOfManufacture}</p>
                <p><span className="font-semibold">Registration:</span> {truck.registrationNumber}</p>
                <p><span className="font-semibold">Insurance:</span> {truck.insuranceNumber}</p>
                <p><span className="font-semibold">Last Maintenance:</span> {truck.lastMaintenanceDate}</p>
                <p><span className="font-semibold">Status:</span> {truck.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}