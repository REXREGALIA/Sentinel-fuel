import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueData, setRevenueData] = useState({});
  const [pumpStats, setPumpStats] = useState([]);
  const [truckAssignments, setTruckAssignments] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const pumpsRef = collection(db, 'pumps');
        const trucksRef = collection(db, 'trucks');
        const trackingRef = collection(db, 'tracking');

        // Get all pumps data
        const pumpsSnapshot = await getDocs(pumpsRef);
        const pumpsData = [];
        
        for (const pumpDoc of pumpsSnapshot.docs) {
          const pump = pumpDoc.data();
          
          // Get tracking data for this pump
          const trackingQuery = query(trackingRef, where('pumpId', '==', pumpDoc.id));
          const trackingSnapshot = await getDocs(trackingQuery);
          
          // Calculate revenue
          let totalRevenue = 0;
          let fuelDelivered = 0;
          trackingSnapshot.forEach(doc => {
            const tracking = doc.data();
            totalRevenue += tracking.fuelAmount * tracking.fuelRate;
            fuelDelivered += tracking.fuelAmount;
          });

          pumpsData.push({
            id: pumpDoc.id,
            name: pump.name,
            location: pump.location,
            revenue: totalRevenue,
            fuelDelivered,
            pendingCollection: totalRevenue // Assuming all revenue is pending
          });
        }

        setPumpStats(pumpsData);

        // Get truck assignments
        const trucksSnapshot = await getDocs(trucksRef);
        const assignments = {};
        
        trucksSnapshot.forEach(doc => {
          const truck = doc.data();
          if (truck.assignedPumpId) {
            if (!assignments[truck.assignedPumpId]) {
              assignments[truck.assignedPumpId] = [];
            }
            assignments[truck.assignedPumpId].push({
              id: doc.id,
              number: truck.number,
              status: truck.status
            });
          }
        });

        setTruckAssignments(assignments);
        
        // Prepare revenue data for charts
        const revenueByDay = {};
        trackingSnapshot.forEach(doc => {
          const tracking = doc.data();
          const date = new Date(tracking.timestamp).toLocaleDateString();
          revenueByDay[date] = (revenueByDay[date] || 0) + (tracking.fuelAmount * tracking.fuelRate);
        });

        setRevenueData(revenueByDay);
        
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics Dashboard</h1>

      {/* Custom Tabs */}
      <div className="flex space-x-2 mb-6">
        {['overview', 'pumps', 'trucks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Revenue Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-blue-600">
                ₹{pumpStats.reduce((acc, pump) => acc + pump.revenue, 0).toLocaleString()}
              </p>
              <div className="h-48 mt-4">
                <Line
                  data={{
                    labels: Object.keys(revenueData),
                    datasets: [{
                      label: 'Daily Revenue',
                      data: Object.values(revenueData),
                      borderColor: 'rgb(59, 130, 246)',
                      tension: 0.1
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            {/* Pending Collections Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Pending Collections</h3>
              <p className="text-3xl font-bold text-red-600">
                ₹{pumpStats.reduce((acc, pump) => acc + pump.pendingCollection, 0).toLocaleString()}
              </p>
              <div className="h-48 mt-4">
                <Pie
                  data={{
                    labels: pumpStats.map(pump => pump.name),
                    datasets: [{
                      data: pumpStats.map(pump => pump.pendingCollection),
                      backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                      ]
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            {/* Fuel Delivered Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Fuel Delivered</h3>
              <p className="text-3xl font-bold text-green-600">
                {pumpStats.reduce((acc, pump) => acc + pump.fuelDelivered, 0).toLocaleString()} L
              </p>
              <div className="h-48 mt-4">
                <Bar
                  data={{
                    labels: pumpStats.map(pump => pump.name),
                    datasets: [{
                      label: 'Fuel Delivered (L)',
                      data: pumpStats.map(pump => pump.fuelDelivered),
                      backgroundColor: 'rgba(59, 130, 246, 0.5)'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pumps' && (
          <div className="grid gap-6 md:grid-cols-2">
            {pumpStats.map(pump => (
              <div key={pump.id} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">{pump.name}</h3>
                <p className="text-gray-600 mb-4">{pump.location}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="font-semibold">₹{pump.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Collection</span>
                    <span className="font-semibold text-red-600">
                      ₹{pump.pendingCollection.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Delivered</span>
                    <span className="font-semibold">{pump.fuelDelivered.toLocaleString()} L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trucks' && (
          <div className="grid gap-6 md:grid-cols-2">
            {pumpStats.map(pump => (
              <div key={pump.id} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">{pump.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {truckAssignments[pump.id]?.map(truck => (
                    <span
                      key={truck.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        truck.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {truck.number}
                    </span>
                  )) || (
                    <span className="text-gray-500">No trucks assigned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 