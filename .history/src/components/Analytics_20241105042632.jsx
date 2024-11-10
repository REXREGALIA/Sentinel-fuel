import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from '@/components/ui/charts';
import { Badge } from "@/components/ui/badge";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { Loader2 } from "lucide-react";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({});
  const [pumpStats, setPumpStats] = useState([]);
  const [truckAssignments, setTruckAssignments] = useState({});

  // Fetch data from Firestore
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pumps">Pump Analysis</TabsTrigger>
          <TabsTrigger value="trucks">Truck Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Overall revenue from all pumps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{pumpStats.reduce((acc, pump) => acc + pump.revenue, 0).toLocaleString()}
                </div>
                <LineChart 
                  data={Object.entries(revenueData).map(([date, amount]) => ({
                    x: date,
                    y: amount
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Collections</CardTitle>
                <CardDescription>Amount to be collected from pumps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ₹{pumpStats.reduce((acc, pump) => acc + pump.pendingCollection, 0).toLocaleString()}
                </div>
                <PieChart 
                  data={pumpStats.map(pump => ({
                    name: pump.name,
                    value: pump.pendingCollection
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fuel Delivered</CardTitle>
                <CardDescription>Total fuel delivered to all pumps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pumpStats.reduce((acc, pump) => acc + pump.fuelDelivered, 0).toLocaleString()} L
                </div>
                <BarChart 
                  data={pumpStats.map(pump => ({
                    name: pump.name,
                    value: pump.fuelDelivered
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pumps">
          <div className="grid gap-4">
            {pumpStats.map(pump => (
              <Card key={pump.id}>
                <CardHeader>
                  <CardTitle>{pump.name}</CardTitle>
                  <CardDescription>{pump.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <span>Revenue:</span>
                      <span className="font-bold">₹{pump.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Collection:</span>
                      <span className="font-bold text-red-600">₹{pump.pendingCollection.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fuel Delivered:</span>
                      <span className="font-bold">{pump.fuelDelivered.toLocaleString()} L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trucks">
          <div className="grid gap-4">
            {pumpStats.map(pump => (
              <Card key={pump.id}>
                <CardHeader>
                  <CardTitle>{pump.name}</CardTitle>
                  <CardDescription>Assigned Trucks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {truckAssignments[pump.id]?.map(truck => (
                      <Badge key={truck.id} variant={truck.status === 'active' ? 'default' : 'secondary'}>
                        {truck.number}
                      </Badge>
                    )) || <span className="text-gray-500">No trucks assigned</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics; 